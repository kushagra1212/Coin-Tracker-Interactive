import React from 'react';
import { Text, View } from 'react-native';
import LoadingComponent from './Loading';
import CoinListSekeleton, { CoinCardSekeleton } from '../CoinListSekeleton';
import { COLORS } from '../../constants/theme';

type props = {
  loading: boolean;
  reachedEnd: boolean;
};
const RenderFooter: React.FC<props> = React.memo(({ loading, reachedEnd }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: -20,
      }}
    >
      {loading ? (
        <CoinListSekeleton amount={5} />
      ) : reachedEnd ? (
        <View
          style={{
            display: 'flex',
            height: 30,
            position: 'absolute',
            backgroundColor: COLORS.black,
            width: '100%',
            elevation: 30,
          }}
        >
          <Text
            style={{
              color: COLORS.GrayPrimary,
              textAlign: 'center',
              fontWeight: 'bold',
              opacity: 0.6,
            }}
          >
            You've reached end.
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export default RenderFooter;
