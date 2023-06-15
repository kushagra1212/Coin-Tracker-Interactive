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
import VerticalBarForGraph from './VerticalBarForChart';

type Props = {
  chartData: ChartData;
};
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CHART_WIDTH = 1000;

export const CHART_START_X = -CHART_WIDTH + (3 * SCREEN_WIDTH) / 2;
export const CHART_HEIGHT = 500;
const LineGraphWithZoom: React.FC<Props> = React.memo(({ chartData }) => {

  const maxValue = useMemo(() => Math.max(...chartData.datasets[0].data), []);
  const minValue = useMemo(() => Math.min(...chartData.datasets[0].data), [])


  return (
    <ReactNativeZoomableView
      maxZoom={3}
      contentWidth={CHART_WIDTH}
      initialOffsetX={CHART_START_X}
      panBoundaryPadding={40}
      contentHeight={CHART_HEIGHT}
    >
      <View>
        <LineChart
          data={chartData}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          withVerticalLabels={true}
          withVerticalLines={false}
          withDots={false}
          withHorizontalLines={false}
          chartConfig={{
            backgroundGradientFrom: '#000000', // Black background
            backgroundGradientTo: '#000000', // Dark gray background
            decimalPlaces: 0,
            color: (opacity = 0) => `rgba(255, 50, 50, 1)`, // Red line color
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White label color
            strokeWidth: 1,
            propsForLabels: {
              fontWeight: 'bold',
            },
            propsForHorizontalLabels: {
              opacity: 0,
            },
            paddingRight: 0,
          }}
          bezier
          withOuterLines={false}
          style={{
            paddingBottom: -90,
            paddingTop: 0,
            margin: 0,
          }}

        />
        <VerticalBarForGraph chartData={chartData} maxValue={maxValue} minValue={minValue} />

      </View>
    </ReactNativeZoomableView>
  );
});

export default LineGraphWithZoom;
