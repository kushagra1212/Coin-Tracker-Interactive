import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataItem, SortBy } from '../types';
import { database } from '../sqlite-storage/database';

type props = {};

const CoinList: React.FC<props> = () => {
  let websocket = useRef<WebSocket>().current;
  const [sortBy, setSortBy] = useState<SortBy>({
    type: 'lastPrice',
    order: 'desc',
  });
  const [coins, setCoins] = useState<DataItem[]>([]);
  const [unMounted, setUnMounted] = useState(false);
  const [currentWindow, setCurrentWindow] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const windowSize = 30;

  // const onViewableItemsChanged = useRef(
  //   ({ viewableItems }: { viewableItems: ViewToken[] }) => {
  //     if (
  //       viewableItems !== undefined &&
  //       viewableItems !== null &&
  //       viewableItems.length > 0 &&
  //       viewableItems[0]?.item?.symbol !== undefined
  //     ) {
  //       const dataMap = new Map();
  //       if (websocket) {
  //         websocket.onmessage = (event) => {
  //           const message = JSON.parse(event.data);

  //           if (Array.isArray(message)) {
  //             for (let i = 0; i < message.length; i++) {
  //               const { s, c, v } = message[i];
  //               dataMap.set(s, { lastPrice: c, volume: v });
  //             }
  //             for (let i = 0; i < viewableItems.length; i++) {
  //               const { symbol } = viewableItems[i].item;
  //               if (dataMap.has(symbol)) {
  //                 const { lastPrice, volume } = dataMap.get(symbol);
  //                 viewableItems[i].item.lastPrice = lastPrice;
  //                 viewableItems[i].item.volume = volume;
  //               }
  //             }
  //           }
  //         };
  //       }
  //     }
  //   }
  // ).current;
  const fetchData = async (
    sort_by: SortBy,
    current_window: number,
    start = false
  ) => {
    if (loading) return;
    try {
      setLoading(true);
      let conntentSize = windowSize + 20;
      let startIndex = (current_window - 1) * conntentSize;
      console.log(startIndex, 'startindex');

      const res = await database.getData(
        sort_by.type,
        sort_by.order,
        startIndex,
        conntentSize
      );
      if (start) setCoins(res);
      else setCoins([...coins, ...res]);
      setCurrentWindow(current_window);

      setSortBy(sort_by);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  // useEffect(() => {
  //   websocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
  //   websocket.onopen = () => {
  //     console.log('WebSocket connected');
  //   };

  //   websocket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };
  //   return () => {
  //     if (websocket !== undefined && websocket) websocket.close();
  //   };
  // }, []);

  const handleSort = (column: SortBy['type']) => {
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
    setLoading(false);
  };
  const fetchNextWindow = () => {
    fetchData(sortBy, currentWindow + 1, false);
    setLoading(false);
  };
  useEffect(() => {
    if (unMounted) return;

    if (!loading) {
      fetchData(sortBy, 1, true);
      setLoading(false);
    }

    return () => {
      setUnMounted(true);
    };
  }, []);

  return (
    <SafeAreaView
      style={{ display: 'flex', backgroundColor: 'red', margin: 5 }}
    >
      <View
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
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={coins}
          contentContainerStyle={{
            backgroundColor: 'green',
            padding: 5,
          }}
          viewabilityConfig={{
            minimumViewTime: 600,
            itemVisiblePercentThreshold: 60,
          }}
          initialNumToRender={windowSize}
          windowSize={windowSize}
          onEndReached={fetchNextWindow}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
            const { symbol, lastPrice, volume } = item;

            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  margin: 1,
                }}
              >
                <Text style={{ color: 'black', flex: 1 / 3 }}>
                  {symbol.replace('USDT', '')}
                </Text>
                <Text style={{ color: 'black', flex: 1 / 3 }}>
                  {parseFloat(lastPrice).toFixed(2)}
                </Text>
                <Text style={{ color: 'black', flex: 1 / 3 }}>
                  {parseFloat(volume).toFixed(2)}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => String(item.symbol + index.toString())}
        />
      )}
    </SafeAreaView>
  );
};

export default CoinList;
