import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { DataItem } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { getValueAndColor, getVariables } from '../../utils';

type props = {
  item: DataItem;
  handleNavigationToCoinScreen: () => void;
};
const RenderCoin: React.FC<props> = ({
  item,
  handleNavigationToCoinScreen,
}) => {
  const {
    symbol,
    lastPrice: initialLastPrice,
    volume: initialVolume,
    prev,
  } = item;
  const COIN_SYMBOL = React.useMemo(
    () => symbol.replace('USDT', '').toLowerCase(),
    [symbol]
  );
  const priceVar = React.useMemo(
    () => ({
      ...getValueAndColor(initialLastPrice, prev?.lastPrice),
      ...getVariables(initialLastPrice, prev?.lastPrice),
    }),
    [initialLastPrice]
  );
  const volumeVar = React.useMemo(
    () => ({
      ...getValueAndColor(initialVolume, prev?.volume),
      ...getVariables(initialVolume, prev?.volume),
    }),
    [initialVolume]
  );
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
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        onPress={handleNavigationToCoinScreen}
      >
        <Image
          source={{
            uri: `https://coinicons-api.vercel.app/api/icon/${COIN_SYMBOL}`,
          }}
          style={{
            width: 20,
            height: 20,
            opacity: 0.9,
          }}
        />
        <View>
          <Text
            style={{
              flex: 1 / 3,
              color: 'black',
            }}
          >
            Bitcoin
          </Text>
          <Text
            style={{
              flex: 1 / 3,
              color: 'black',
            }}
          >
            {COIN_SYMBOL}
          </Text>

          <Text style={{ color: 'black' }}>
            {priceVar.commanPrefix}
            {priceVar.isChanged ? (
              <Text style={{ color: priceVar.color }}>
                {priceVar.nextValueSuffix}
                {' ( ' + priceVar.percent.toFixed(2) + ' )%'}
              </Text>
            ) : null}
          </Text>
          <Text style={{ color: 'black' }}>
            {volumeVar.commanPrefix}
            {volumeVar.isChanged ? (
              <Text style={{ color: volumeVar.color }}>
                {volumeVar.nextValueSuffix}
                {' ( ' + volumeVar.percent.toFixed(2) + ' )%'}
              </Text>
            ) : null}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RenderCoin;
