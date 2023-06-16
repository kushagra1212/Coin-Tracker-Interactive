import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const SkeletonLoader = ({
  width = 200,
  height = 20,
  roundness = 10,
  duration = 800,
  color = 'red',
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const opacityInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.placeholder,
          {
            opacity: opacityInterpolation,
            backgroundColor: '#444444',
            width: width,
            height: height,
            borderRadius: roundness,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    marginBottom: 10,
  },
});

export default SkeletonLoader;
