import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const LineGraphSkeleton = ({ width, height, duration, lineColor }: any) => {
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

  const lineOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.7],
  });

  const data = {
    labels: Array.from({ length: 20 }, (_, index) => ``),
    datasets: [
      {
        data: Array.from({ length: 20 }, () => Math.random() * 100),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.blurContainer}>
        <Animated.View
          style={[
            styles.chartContainer,
            {
              width: width,
              height: height,
              opacity: lineOpacity,
              backgroundColor: `rgba(0, 0, 0, 0.7)`, // Semi-transparent white color
            },
          ]}
        >
          <LineChart
            data={data}
            width={width}
            height={height}
            withVerticalLines={false}
            onDataPointClick={(data) => {}}
            withDots={false}
            withHorizontalLines={false}
            chartConfig={{
              backgroundGradientFrom: '#000111', // Black background
              backgroundGradientTo: '#000000', // Dark gray background
              decimalPlaces: 0,
              color: (opacity = 0) => `${lineColor}`, // Red line color
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White label color
              width: Dimensions.get('window').width,
              propsForHorizontalLabels: {
                opacity: 0, // Hide the Y-axis line
              },
            }}
            bezier
            withOuterLines={false}
            style={{
              marginLeft: -16,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {},
  chartContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default LineGraphSkeleton;
