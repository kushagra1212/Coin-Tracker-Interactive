import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Text, TouchableOpacity, View } from 'react-native';
import CoinChart from '../components/chart/CoinChart';
import CryptoLineGraph from '../components/chart/CryptoLineGraph';
import { COLORS } from '../constants/theme';
type props = NativeStackScreenProps<RootStackParamList, 'Coin'>;

const CoinScreen: React.FC<props> = ({ route, navigation }) => {
  const { coinSymbol,initialVolume } = route.params;
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
      <CryptoLineGraph coinSymbol={coinSymbol} initialVolume={initialVolume} />
  );
};

export default CoinScreen;
