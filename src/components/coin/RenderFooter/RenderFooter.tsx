import React from 'react';
import { Text, View } from 'react-native';
import CoinListSekeleton from '../../Loading/CoinListSekeleton';
import styles from './styles';

type props = {
  loading: boolean;
  reachedEnd: boolean;
};
const RenderFooter: React.FC<props> = React.memo(({ loading, reachedEnd }) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <CoinListSekeleton amount={5} /> // Render the CoinListSkeleton component while loading
      ) : reachedEnd ? (
        <View style={styles.reachedEndContainer}>
          <Text style={styles.reachedEndText}>You've reached the end.</Text>
        </View>
      ) : null}
    </View>
  );
});

export default RenderFooter;
