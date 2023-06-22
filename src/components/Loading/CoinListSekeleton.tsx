import React from 'react';
import { View } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { COLORS } from '../../constants/theme';
import { StyleSheet } from 'react-native';
type propsList = {
  amount: number;
};
type propsCard = {};

export const CoinCardSekeleton: React.FC<propsCard> = React.memo(() => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <SkeletonLoader height={60} width={60} roundness={40} duration={2000} />
      </View>
      <View style={styles.infoContainer}>
        <SkeletonLoader height={50} width={100} roundness={5} duration={2000} />
      </View>
      <View style={styles.detailsContainer}>
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.blackPure,
    height: 100,
    paddingRight: 0,
    marginTop: 5,
    borderRadius: 10,
  },
  imageContainer: {
    flex: 1 / 4,
  },
  infoContainer: {
    flex: 1 / 4,
  },
  detailsContainer: {
    flex: 1 / 2,
    marginRight: 50,
    marginTop: 20,
  },
});

export default CoinListSekeleton;
