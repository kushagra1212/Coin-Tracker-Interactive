import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CoinList from '../components/coin/CoinList/CoinList';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return <CoinList navigation={navigation} />;
};

export default HomeScreen;
