import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Text, TouchableOpacity, View } from 'react-native';
import CoinChart from '../components/chart/CoinChart';
import CryptoLineGraph from '../components/chart/CryptoLineGraph';
type props = NativeStackScreenProps<RootStackParamList, 'Coin'>;

const CoinScreen: React.FC<props> = ({ route, navigation }) => {
  const { coinSymbol } = route.params;

  return (
    <View style={{ flex: 1 }}>
      {/* <CoinChart coinSymbol={coinSymbol} interval="1d" limit={20} /> */}
      <CryptoLineGraph />
    </View>
  );
};

export default CoinScreen;
