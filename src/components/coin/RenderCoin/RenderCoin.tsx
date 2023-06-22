import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { DataItem } from '../../../types';
import { getValueAndColor, getVariables } from '../../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS, FONTS } from '../../../constants/theme';
import { Database } from '../../../sqlite-storage/database';
import styles from './styles';
import { GestureResponderEvent } from '@shopify/react-native-performance';
import { COIN_IMAGE_ENDPOINT } from '../../../constants/endpoints';

type props = {
  item: DataItem;
  handleNavigationToCoinScreen: (uiEvent: GestureResponderEvent) => void;
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
    () =>
      symbol.replace('USDT', '').toLowerCase()[0].toUpperCase() +
      symbol.replace('USDT', '').toLowerCase().slice(1),
    [symbol]
  );
  const [cryptoName, setCryptoName] = useState<string>('');
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

  const getCryptoName = async () => {
    try {
      const name = await Database.getInstance().getCryptoName(
        COIN_SYMBOL.toLowerCase()
      );
      const upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
      const updatedName = upperCaseName.slice(0, 10);
      if (updatedName.length < upperCaseName.length) {
        setCryptoName(updatedName + '...');
      } else {
        setCryptoName(updatedName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (COIN_SYMBOL && cryptoName === '') {
      getCryptoName();
    }
  }, [COIN_SYMBOL]);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={(uiEvent: GestureResponderEvent) =>
        handleNavigationToCoinScreen(uiEvent)
      }
    >
      <Image
        source={{
          uri: `${COIN_IMAGE_ENDPOINT}/${symbol
            .replace('USDT', '')
            .toLowerCase()}`,
        }}
        style={styles.coinImage}
      />

      <View style={styles.coinInfoContainer}>
        <Text style={styles.coinSymbol}>{COIN_SYMBOL}</Text>
        <Text style={styles.coinName}>{cryptoName}</Text>
      </View>

      <View style={styles.priceInfoContainer}>
        <Text style={styles.priceText}>
          {priceVar.isChanged ? (
            <Icon
              name={priceVar.icon}
              size={15}
              color={
                priceVar.sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary
              }
              style={priceVar.sign !== '-' ? { top: 10 } : {}}
            />
          ) : null}
          {priceVar.isChanged ? '  $ ' : '$ '} {priceVar.commanPrefix}
          {priceVar.isChanged ? (
            <Text style={{ color: priceVar.color }}>
              {priceVar.nextValueSuffix}
              {' ( ' + priceVar.percent.toFixed(2) + ' )%'}
            </Text>
          ) : null}
        </Text>

        <Text
          style={[
            FONTS.body4,
            { color: COLORS.white, fontWeight: 'bold', marginTop: 5 },
          ]}
        >
          {/* 
          
          If Need to show volume in coin screen in future - @kushagra1212 
          
          {volumeVar.isChanged ? (
            <Icon
              name={volumeVar.icon}
              size={20}
              color={
                volumeVar.sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary
              }
              style={volumeVar.sign !== '-' ? { marginTop: 3 } : {}}
            />
          ) : null} 
          
          
          */}
          {volumeVar.commanPrefix}
          {volumeVar.isChanged ? (
            <Text style={{ color: volumeVar.color }}>
              {volumeVar.nextValueSuffix}
              {/*
              
              If Need to show volume in coin screen in future - @kushagra1212 
              
              {' ( ' + volumeVar.percent.toFixed(2) + ' )%'} 
              
              */}
            </Text>
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderCoin;
