import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataItem, SortBy } from '../../../types';

import { throttle } from '../../../utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useFocusEffect } from '@react-navigation/native';
import RenderCoin from '../RenderCoin/RenderCoin';
import RenderFooter from '../RenderFooter/RenderFooter';
import { database } from '../../../sqlite-storage/database';
import { COLORS } from '../../../constants/theme';
import { FlashList } from '@shopify/flash-list';

import {
  GestureResponderEvent,
  PerformanceMeasureView,
  useStartProfiler,
} from '@shopify/react-native-performance';
import {
  connectWebSocket,
  disconnectWebSocket,
  getWebSocket,
} from '../../../web-socket/web-socket';
import CoinListSekeleton from '../../Loading/CoinListSekeleton';
import CoinListHeader from '../CoinListHeader/CoinListHeader';
import { showMessage } from 'react-native-flash-message';

type props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const CoinList: React.FC<props> = ({ navigation }) => {
  const startNavigationTTITimer = useStartProfiler();

  let reconnectAttemptsRef = useRef<number>(0).current;
  const flatListRef = useRef<FlashList<DataItem> | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>({
    type: 'lastPrice',
    order: 'desc',
  });
  const [coins, setCoins] = useState<DataItem[]>([]);
  const [currentWindow, setCurrentWindow] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const [initialFetchLoad, setInitialFetchLoad] = useState<
    boolean | undefined
  >();

  const [scrollSymbol, setScrollSymbol] = useState<string>('');
  const windowSize = 500;
  const webSocketHandler = (
    event: WebSocketMessageEvent,
    viewableItems: ViewToken[]
  ) => {
    const message = JSON.parse(event.data);

    const dataMap = new Map();
    if (Array.isArray(message)) {
      for (let i = 0; i < message.length; i++) {
        const { s, c, v } = message[i];
        dataMap.set(s, { lastPrice: c, volume: v });
      }
      const items: DataItem[] = [];
      for (let i = 0; i < viewableItems.length; i++) {
        const { symbol } = viewableItems[i].item;
        if (dataMap.has(symbol)) {
          const { lastPrice, volume } = dataMap.get(symbol);

          items.push({
            symbol: symbol,
            lastPrice,
            volume,
            prev: { ...viewableItems[i].item, prev: undefined },
          });
        }
      }
      setCoins((prev) => {
        const newCoins = [...prev];
        for (let i = 0; i < newCoins.length; i++) {
          const index = items.findIndex(
            (item) => item.symbol === newCoins[i].symbol
          );
          if (index !== -1) {
            newCoins[i] = JSON.parse(JSON.stringify(items[index]));
          }
        }
        return newCoins;
      });
    }
  };

  const throttledOnMessage = useCallback(throttle(webSocketHandler, 1000), []);
  const handleOnViewableItemsChanged = (viewableItems: ViewToken[]) => {
    const websocket = getWebSocket();
    if (websocket) {
      websocket.onmessage = (event) => {
        throttledOnMessage(event, viewableItems);
      };
    }
  };
  const scrollOneItemBelow = () => {
    if (flatListRef.current) {
      const index = coins.findIndex((item) => item.symbol === scrollSymbol);
      flatListRef.current.scrollToIndex({ index: index, animated: true });
    }
  };
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems !== undefined &&
        viewableItems !== null &&
        viewableItems.length > 0 &&
        viewableItems[0]?.item?.symbol !== undefined
      ) {
        handleOnViewableItemsChanged(viewableItems);
      }
    }
  ).current;

  const fetchData = async (
    sort_by: SortBy,
    current_window: number,
    start = false
  ) => {
    try {
      setSortBy(sort_by);
      setLoading(true);
      if (start === true) setInitialFetchLoad(true);
      let contentSize = windowSize;
      let startIndex = (current_window - 1) * contentSize;

      const res = await database.getData(
        sort_by.type,
        sort_by.order,
        startIndex,
        contentSize
      );

      if (res && res.length > 0) {
        if (start) setCoins(res);
        else {
          setCoins((prev) => {
            prev.push(...res);
            return prev;
          });
        }
      } else {
        setReachedEnd(true);
      }
      if (start) {
        setInitialFetchLoad(false);
      }
      setLoading(false);

      setCurrentWindow(current_window);
    } catch (err) {
      setLoading(false);
      console.log(err);
      showMessage({
        message: 'Network Error',
        description: 'Something went wrong, please try again later',
        type: 'danger',
        duration: 7000,
        icon: 'danger',
        style: {
          borderRadius: 10,
          margin: 10,
          backgroundColor: '#333',
        },
      });
    }
  };

  const handleSort = async ({ type, order }: SortBy) => {
    if (loading) return;
    setReachedEnd(false);
    fetchData(
      {
        type,
        order,
      },
      1,
      true
    );
  };
  const fetchNextWindow = () => {
    if (loading || reachedEnd) return;
    fetchData(sortBy, currentWindow + 1, false);
  };
  const reconnectWebSocket = () => {
    // Exponential backoff strategy

    if (reconnectAttemptsRef !== 0) {
      const reconnectDelay = Math.pow(Number(4), reconnectAttemptsRef) * 1000;

      setTimeout(() => {
        connectWebSocket();
        reconnectAttemptsRef++;
      }, reconnectDelay);
    } else {
      connectWebSocket();
      reconnectAttemptsRef++;
    }
  };

  const handleNavigationToCoinScreen = (
    uiEvent: GestureResponderEvent,
    coinSymbol: string,
    volume: string
  ) => {
    setScrollSymbol(coinSymbol);
    startNavigationTTITimer({
      source: 'Home',
      uiEvent,
    });
    const removeWebSocketHandler = () => {
      return () => {
        disconnectWebSocket();
      };
    };
    setTimeout(removeWebSocketHandler(), 0);

    navigation.navigate('Coin', {
      coinSymbol: coinSymbol,
      initialVolume: volume,
    });
  };
  const renderFooter = () => {
    return <RenderFooter loading={loading} reachedEnd={reachedEnd} />;
  };
  const renderItemComponent = ({ item }: { item: DataItem }) => {
    return (
      <RenderCoin
        item={item}
        handleNavigationToCoinScreen={(uiEvent: GestureResponderEvent) =>
          handleNavigationToCoinScreen(uiEvent, item.symbol, item.volume)
        }
      />
    );
  };

  useEffect(() => {
    const websocket = getWebSocket();
    let unMounted = false;
    if (unMounted) return;
    console.log('Component: CoinList mounted');

    if (!loading) {
      fetchData(sortBy, 1, true);
    }

    return () => {
      unMounted = true;
      console.log('Component: CoinList Unmounted');
      if (websocket !== null && websocket) {
        console.log('closing websocket Component unmounted');
        websocket.close();
      }
    };
  }, []);

  useFocusEffect(() => {
    const websocket = getWebSocket();
    if (websocket === null) {
      reconnectWebSocket();
      scrollOneItemBelow();
    }
  });

  return (
    <PerformanceMeasureView
      interactive={initialFetchLoad !== undefined}
      screenName="Home"
    >
      <SafeAreaView
        style={{
          display: 'flex',
          backgroundColor: COLORS.black,
          margin: 0,
          height: 1000,
        }}
      >
        <CoinListHeader handleSortBy={handleSort} {...sortBy} />
        {initialFetchLoad ? (
          <CoinListSekeleton amount={10} />
        ) : (
          <FlashList
            ref={flatListRef}
            data={coins}
            onEndReached={fetchNextWindow}
            onViewableItemsChanged={onViewableItemsChanged}
            onEndReachedThreshold={10}
            estimatedItemSize={6000}
            renderItem={renderItemComponent}
            ListFooterComponent={renderFooter}
            keyExtractor={(item, index) => item.symbol}
          />
        )}
      </SafeAreaView>
    </PerformanceMeasureView>
  );
};
export default CoinList;
