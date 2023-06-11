import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { DataItem } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
type props = {
  item: DataItem;
  handleNavigationToCoinScreen: () => void;
};
const RenderCoin: React.FC<props> = React.memo(
  ({ item, handleNavigationToCoinScreen }) => {
    const {
      symbol,
      lastPrice: initialLastPrice,
      volume: initialVolume,
      prev,
    } = item;

    const getTextColor = (newValue: number, oldValue: number) => {
      if (newValue > oldValue) {
        return 'green';
      } else if (newValue < oldValue) {
        return 'red';
      }
      if (newValue !== oldValue) {
        console.log('new value: ', newValue, 'old value: ', oldValue);
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
          onPress={handleNavigationToCoinScreen}
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
                parseFloat(initialLastPrice),
                parseFloat(
                  prev === undefined ? initialLastPrice : prev.lastPrice
                )
              ),
              flex: 1 / 3,
            }}
          >
            {parseFloat(initialLastPrice).toFixed(2)}
          </Text>
          <Text
            style={{
              color: getTextColor(
                parseFloat(initialVolume),
                parseFloat(prev === undefined ? initialVolume : prev.volume)
              ),
              flex: 1 / 3,
            }}
          >
            {parseFloat(initialVolume).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default RenderCoin;
