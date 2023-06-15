import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataItem, SortBy } from '../../types';

import { throttle } from '../../utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useFocusEffect } from '@react-navigation/native';
import RenderCoin from './RenderCoin';
import LoadingComponent from './Loading';
import RenderFooter from './RenderFooter';
import { database } from '../../sqlite-storage/database';
type props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const CoinList: React.FC<props> = React.memo(({ navigation }) => {
  let websocket = useRef<WebSocket>();
  let reconnectAttemptsRef = useRef<number>(0).current;
  const flatListRef = useRef<FlatList<DataItem> | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>({
    type: 'lastPrice',
    order: 'desc',
  });
  const [coins, setCoins] = useState<DataItem[]>([]);
  const [currentWindow, setCurrentWindow] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const [initialFetchLoad, setInitialFetchLoad] = useState<boolean>(true);
  const [loadOtherScreen, setLoadOtherScreen] = useState<boolean>(false);
  const [scrollSymbol, setScrollSymbol] = useState<string>('');
  const windowSize = 10;
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

  const throttledOnMessage = useCallback(throttle(webSocketHandler, 2000), []);
  const handleOnViewableItemsChanged = (viewableItems: ViewToken[]) => {
    if (websocket.current) {
      let timeNow = Date.now();
      websocket.current.onmessage = (event) => {
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
    if (loading || reachedEnd) return;
    try {
      setLoading(true);
      if (start === true) setInitialFetchLoad(true);
      let contentSize = windowSize;
      let startIndex = (current_window - 1) * contentSize;
      console.log(startIndex, 'startindex');
      const initalTime = Date.now();
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

      setSortBy(sort_by);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleSort = async (column: SortBy['type']) => {
    if (sortBy.type === column) {
      fetchData(
        {
          ...sortBy,
          order: sortBy.order === 'asc' ? 'desc' : 'asc',
        },
        1,
        true
      );
    } else {
      fetchData(
        {
          ...sortBy,
          type: column,
        },
        1,
        true
      );
    }
  };
  const fetchNextWindow = () => {
    fetchData(sortBy, currentWindow + 1, false);
  };
  const reconnectWebSocket = () => {
    // Exponential backoff strategy

    if (reconnectAttemptsRef !== 0) {
      const reconnectDelay = Math.pow(Number(4), reconnectAttemptsRef) * 1000;

      setTimeout(() => {
        createWebSocketConnection();
        reconnectAttemptsRef++;
      }, reconnectDelay);
    } else {
      createWebSocketConnection();
      reconnectAttemptsRef++;
    }
  };
  const createWebSocketConnection = () => {
    websocket.current = new WebSocket(
      'wss://stream.binance.com:9443/ws/!ticker@arr'
    );

    websocket.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocket.current.onclose = (event) => {
      console.log('WebSocket connection closed:');
      // reconnectWebSocket();
    };
  };
  const handleNavigationToCoinScreen = (coinSymbol: string, volume: string) => {
    setScrollSymbol(coinSymbol);
    if (websocket.current !== undefined && websocket.current) {
      console.log('closing websocket : Component CoinList');
      const removeWebSocketHandler = () => {
        const ws = websocket.current;
        return () => {
          console.log('Disconnecting websocket');
          if (ws) ws.close();
        };
      };
      setTimeout(removeWebSocketHandler(), 0);
    }

    navigation.navigate('Coin', {
      coinSymbol: coinSymbol,
      initialVolume: volume,
    });
  };
  useEffect(() => {
    let unMounted = false;
    if (unMounted) return;
    console.log('Component: CoinList mounted');
    createWebSocketConnection();
    if (!loading) {
      fetchData(sortBy, 1, true);
    }

    return () => {
      unMounted = true;
      console.log('Component: CoinList Unmounted');
      if (websocket.current !== undefined && websocket.current) {
        console.log('closing websocket Component unmounted');
        websocket.current.close();
      }
    };
  }, []);
  useFocusEffect(() => {
    if (
      websocket.current !== undefined &&
      websocket.current.readyState === WebSocket.CLOSED
    ) {
      reconnectWebSocket();
      scrollOneItemBelow();
    }
  });

  if (initialFetchLoad) {
    return <LoadingComponent />;
  }
  const renderFooter = () => {
    return <RenderFooter loading={loading} reachedEnd={reachedEnd} />;
  };
  const renderItemComponent = ({ item }: { item: DataItem }) => {
    return (
      <RenderCoin
        item={item}
        handleNavigationToCoinScreen={() =>
          handleNavigationToCoinScreen(item.symbol, item.volume)
        }
      />
    );
  };

  return (
    <SafeAreaView
      style={{ display: 'flex', backgroundColor: 'red', margin: 5 }}
    >
      {/* <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          height: 50,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            alignSelf: 'stretch',
            flex: 1 / 3,
          }}
          onPress={(e) => console.log('pressed')}
          onPressIn={() => {}}
        >
          <Text>Symbol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'black', flex: 1 / 3 }}
          onPressIn={() => handleSort('lastPrice')}
        >
          <Text>Price</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 / 3 }}
          onPressIn={() => handleSort('volume')}
        >
          <Text>Volume</Text>
        </TouchableOpacity>
      </View> */}
      <FlatList
        ref={flatListRef}
        data={coins}
        contentContainerStyle={{
          backgroundColor: 'green',
          padding: 5,
          paddingBottom: 150,
        }}
        viewabilityConfig={{
          minimumViewTime: 0,
          itemVisiblePercentThreshold: 0,
        }}
        initialNumToRender={windowSize}
        onEndReached={fetchNextWindow}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReachedThreshold={0.8}
        renderItem={renderItemComponent}
        ListFooterComponent={renderFooter}
        keyExtractor={(item, index) => item.symbol}
      />
    </SafeAreaView>
  );
});
export default CoinList;
