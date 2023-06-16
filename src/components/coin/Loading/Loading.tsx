import React from 'react';
import { ActivityIndicator, View } from 'react-native';

type props = {};
const LoadingComponent: React.FC<props> = React.memo(() => {
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
});
export default LoadingComponent;
