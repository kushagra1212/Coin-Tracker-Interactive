import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Text, View} from 'react-native';
type props = NativeStackScreenProps<RootStackParamList, 'Coin'>;

const CoinScreen: React.FC<props> = () => {
  return (
    <View>
      <Text>Coin Screen</Text>
    </View>
  );
};

export default CoinScreen;
