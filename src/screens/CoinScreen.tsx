import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import CryptoLineGraph from '../components/chart/CryptoLineChart/CryptoLineChart';
import { COLORS } from '../constants/theme';
import { RootStackParamList } from '../types';

type props = NativeStackScreenProps<RootStackParamList, 'Coin'>;

const CoinScreen: React.FC<props> = ({ route, navigation }) => {
  const { coinSymbol, initialVolume } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: coinSymbol.replace('USDT', ''),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: COLORS.GrayPrimary,
        fontSize: 20,
        fontWeight: 'bold',
      },
      headerBackground: () => (
        <View style={{ flex: 1, backgroundColor: COLORS.blackPure }}></View>
      ),
      headerTintColor: COLORS.white,
    });
  }, []);
  return (
    <CryptoLineGraph
      navigation={navigation}
      coinSymbol={coinSymbol}
      initialVolume={initialVolume}
    />
  );
};

export default CoinScreen;
