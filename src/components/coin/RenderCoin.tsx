import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { DataItem } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
type props = {
  item: DataItem;
  handleNavigationToCoinScreen: (symbol: string) => void;
};
const RenderCoin: React.FC<props> = React.memo(
  ({ item, handleNavigationToCoinScreen }) => {
    const { symbol, lastPrice: initialLastPrice, volume: initialVolume } = item;
    const [lastPrice, setLastPrice] = useState(initialLastPrice);
    const [volume, setVolume] = useState(initialVolume);

    useEffect(() => {
      // Check if the lastPrice has changed
      if (initialLastPrice !== lastPrice) {
        setLastPrice(initialLastPrice);
      }

      // Check if the volume has changed
      if (initialVolume !== volume) {
        setVolume(initialVolume);
      }
    }, [initialLastPrice, initialVolume]);

    const getTextColor = (newValue: number, oldValue: number) => {
      //console.log(newValue, oldValue);
      if (newValue > oldValue) {
        return 'green';
      } else if (newValue < oldValue) {
        return 'red';
      }
      return 'black';
    };

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          margin: 1,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 / 3, justifyContent: 'center', paddingLeft: 10 }}
          onPress={() => handleNavigationToCoinScreen(symbol)}
        >
          <Text
            style={{
              flex: 1 / 3,
              color: 'black',
            }}
          >
            {symbol.replace('USDT', '')}
          </Text>
          <Text
            style={{
              color: getTextColor(
                parseFloat(lastPrice),
                parseFloat(initialLastPrice)
              ),
              flex: 1 / 3,
            }}
          >
            {parseFloat(lastPrice).toFixed(2)}
          </Text>
          <Text
            style={{
              color: getTextColor(
                parseFloat(volume),
                parseFloat(initialVolume)
              ),
              flex: 1 / 3,
            }}
          >
            {parseFloat(volume).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default RenderCoin;
