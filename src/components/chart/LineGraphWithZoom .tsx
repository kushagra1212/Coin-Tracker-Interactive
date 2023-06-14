import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Dimensions,
  PanResponder,
  Animated,
  GestureResponderEvent,
  Text,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartData } from '../../types';
import { COLORS } from '../../constants/theme';
import { getDistance } from '../../utils';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

type Props = {
  chartData: ChartData;
};
const SCREEN_WIDTH = Dimensions.get('window').width;

const LineGraphWithZoom: React.FC<Props> = React.memo(({ chartData }) => {
  const CHART_WIDTH = 1000;
  console.log(
    CHART_WIDTH,
    's',
    chartData.datasets[0].data.length,
    chartData.labels.length
  );
  const CHART_START_X = -CHART_WIDTH + (3 * SCREEN_WIDTH) / 2;
  const chartHeight = 500;
  const maxValue = Math.max(...chartData.datasets[0].data);
  const minValue = Math.min(...chartData.datasets[0].data);
  const [dotIndex, setDotIndex] = useState<number | null>(null); // State to store the dot index
  const dotXPositions = useMemo(
    () =>
      chartData.datasets[0].data.map((item: number, index: number) => ({
        x: (index / (chartData.datasets[0].data.length - 1)) * CHART_WIDTH, // Assuming CHART_WIDTH represents the total width of the chart
        index: index,
      })),
    []
  );
  const MAX_HEIGHT = 500 - 125;
  const getHeight = (value: number) => {
    return (MAX_HEIGHT / (maxValue - minValue)) * (value - minValue);
  };

  const x_pan = useRef(new Animated.Value(CHART_WIDTH)).current;
  const height_pan = useRef(
    new Animated.Value(
      getHeight(
        chartData.datasets[0].data[chartData.datasets[0].data.length - 1]
      )
    )
  ).current;
  const getTranslateY = () => {
    return MAX_HEIGHT - height_pan._value;
  };
  const translate_y_pan = useRef(new Animated.Value(getTranslateY())).current;

  const calculateDotIndex = (xPosition: number) => {
    const size = dotXPositions.length;
    let closestDot = dotXPositions[0];
    for (let i = 1; i < size; i++) {
      closestDot =
        Math.abs(dotXPositions[i].x - xPosition) <
        Math.abs(closestDot.x - xPosition)
          ? dotXPositions[i]
          : closestDot;
    }
    return closestDot.index;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {},
    onPanResponderMove: (event) => {
      const xPosition = event.nativeEvent.locationX;

      x_pan.setValue(xPosition);
    },
    onPanResponderRelease: (event) => {
      const xPosition = event.nativeEvent.locationX;
      const index = calculateDotIndex(xPosition);
      //console.log('Dot Index:', index);
      // console.log(x_pan._value);
      // height_pan.setValue(getHeight(chartData.datasets[0].data[index]));
      Animated.parallel([
        // Animated.spring(height_pan, {
        //   toValue: getHeight(chartData.datasets[0].data[index]),
        //   useNativeDriver: false,
        // }),
        // Animated.spring(x_pan, {
        //   toValue: xPosition,
        //   useNativeDriver: false,
        // }),
        Animated.spring(translate_y_pan, {
          toValue: getTranslateY(),
          useNativeDriver: false,
        }),
      ]).start();
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <ReactNativeZoomableView
        maxZoom={3}
        contentWidth={CHART_WIDTH}
        initialOffsetX={CHART_START_X}
        panBoundaryPadding={30}
        contentHeight={chartHeight}
      >
        <View>
          <Animated.View
            style={{
              position: 'absolute',
              height: height_pan,
              zIndex: 100,
              width: 20,
              backgroundColor: 'rgba(155, 255, 255, 0.8)',
              transform: [
                {
                  translateX: x_pan,
                },
                {
                  translateY: translate_y_pan,
                },
              ],
            }}
            {...panResponder.panHandlers}
          ></Animated.View>
          <LineChart
            data={chartData}
            width={CHART_WIDTH}
            height={chartHeight}
            withVerticalLabels={true}
            withVerticalLines={false}
            withDots={false}
            withHorizontalLines={false}
            chartConfig={{
              backgroundGradientFrom: 'white', // Black background
              backgroundGradientTo: 'white', // Dark gray background
              decimalPlaces: 0,
              color: (opacity = 0) => `rgba(255, 100, 20, 1)`, // Red line color
              labelColor: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // White label color
              strokeWidth: 1,
              propsForHorizontalLabels: {
                opacity: 0,
              },
            }}
            bezier
            withOuterLines={false}
            style={{
              paddingBottom: -90,
              paddingTop: 0,
              paddingRight: 20,
              paddingLeft: 20,
            }}
          />
        </View>
      </ReactNativeZoomableView>
    </View>
  );
});

export default LineGraphWithZoom;
