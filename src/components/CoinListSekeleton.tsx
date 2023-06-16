import React from 'react';
import { View, Text } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { COLORS } from '../constants/theme';

type propsList = {
  amount: number;
};
type propsCard = {};

export const CoinCardSekeleton: React.FC<propsCard> = React.memo(() => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.blackPure,
        height: 100,
        paddingRight: 0,
        marginTop: 5,
        borderRadius: 10,
      }}
    >
      <View style={{ flex: 1 / 4 }}>
        <SkeletonLoader height={60} width={60} roundness={40} duration={2000} />
      </View>
      <View
        style={{
          flex: 1 / 4,
        }}
      >
        <SkeletonLoader height={50} width={100} roundness={5} duration={2000} />
      </View>

      <View
        style={{
          flex: 1 / 2,
          marginRight: 50,
        }}
      >
        <SkeletonLoader height={30} width={100} roundness={5} duration={2000} />
        <SkeletonLoader height={30} width={100} roundness={5} duration={2000} />
      </View>
    </View>
  );
});

const CoinListSekeleton: React.FC<propsList> = React.memo(({ amount }) => {
  return Array.from(Array(amount).keys()).map((item, index) => (
    <CoinCardSekeleton key={index} />
  ));
});

export default CoinListSekeleton;
