import React from 'react';
import { Text, View } from 'react-native';
import LoadingComponent from './Loading';

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
      }}
    >
      {loading ? (
        <LoadingComponent />
      ) : reachedEnd ? (
        <View
          style={{
            display: 'flex',
            height: 100,
            position: 'absolute',
            backgroundColor: 'red',
            bottom: 0,
            width: '100%',
          }}
        >
          <Text style={{ color: 'black' }}>End of the List</Text>
        </View>
      ) : null}
    </View>
  );
});

export default RenderFooter;
