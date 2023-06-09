import React, { useMemo, useRef, useEffect } from 'react';
import { ChartData } from '../../../types';
import { CHART_WIDTH } from '../LineChartWithZoom/LineChartWithZoom ';
import { Animated, PanResponder, View } from 'react-native';
import { LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import ToolTip from '../ToolTip/ToolTip';
import styles from './styles';

type props = {
  chartData: ChartData;
  minValue: number;
  maxValue: number;
};

const VerticalBarForGraph: React.FC<props> = React.memo(
  ({ chartData, minValue, maxValue }) => {
    let x_off = useRef<number>(60).current;
    const [dotIndex, setDotIndex] = React.useState<number>(
      chartData.datasets[0].data.length - 1
    );
    const dotXPositions = useMemo(
      () =>
        chartData.datasets[0].data.map((item: number, index: number) => ({
          x:
            (index / (chartData.datasets[0].data.length - 1)) *
              (((CHART_WIDTH - 60) / chartData.datasets[0].data.length) *
                (chartData.datasets[0].data.length - 1)) +
            60, // Assuming CHART_WIDTH represents the total width of the chart
          index: index,
        })),
      []
    );
    const MAX_HEIGHT = 500 - 125;

    const getHeight = (value: number) => {
      return (MAX_HEIGHT / (maxValue - minValue)) * (value - minValue);
    };

    const x_pan = useRef(new Animated.Value(0)).current;
    const height_pan = useRef(
      new Animated.Value(getHeight(chartData.datasets[0].data[0]))
    ).current;

    const getTranslateY = () => {
      return MAX_HEIGHT - height_pan._value;
    };

    const translate_y_pan = useRef(new Animated.Value(getTranslateY())).current;
    const releasedResponder = (diff: number) => {
      if (x_off + diff < 60) {
        x_pan.setValue(60 - (x_off + diff));
      } else if (x_off + diff > dotXPositions[dotXPositions.length - 1].x) {
        x_pan.setValue(
          dotXPositions[dotXPositions.length - 1].x - (x_off + diff)
        );
      } else {
        x_off += diff;
        x_pan.extractOffset();
      }
      const { index, x } = calculateDotIndex(x_off);
      setDotIndex(index);
      x_pan.setValue(x - x_off);
      x_off = x;
      x_pan.extractOffset();
      height_pan.setValue(getHeight(chartData.datasets[0].data[index]));
      Animated.parallel([
        Animated.spring(height_pan, {
          toValue: getHeight(chartData.datasets[0].data[index]),
          useNativeDriver: false,
        }),
        Animated.spring(translate_y_pan, {
          toValue: getTranslateY(),
          useNativeDriver: false,
        }),
      ]).start();
    };
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
      return closestDot;
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {},
        onPanResponderMove: (event, gestureState) => {
          const diff = gestureState.moveX - gestureState.x0;

          x_pan.setValue(diff);
        },
        onPanResponderRelease: (event, gestureState) => {
          const diff = gestureState.moveX - gestureState.x0;

          releasedResponder(diff);
        },
      })
    ).current;
    useEffect(() => {
      x_pan.setOffset(dotXPositions[dotXPositions.length - 1].x - 60);
      releasedResponder(dotXPositions[dotXPositions.length - 1].x - 60);
    }, []);
    return (
      <Animated.View
        style={[
          styles.toolTipContainer,
          {
            height: height_pan,
            transform: [
              {
                translateX: x_pan,
              },
              {
                translateY: translate_y_pan,
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={{ height: 200, bottom: 180, width: 2 }}>
          <Svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
              <Stop offset="100%" stopColor="rgba(255,0,0,1)" />
            </LinearGradient>
            <Rect width="100%" height="100%" fill="url(#gradient)" />
          </Svg>
        </View>
        <ToolTip value={chartData.datasets[0].data[dotIndex]} />
        <Svg style={styles.toolTipValue}></Svg>
        <View style={styles.invisibleBackground}></View>
      </Animated.View>
    );
  }
);

export default VerticalBarForGraph;
