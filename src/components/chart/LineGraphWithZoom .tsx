import React, { useState } from 'react';
import { Dimensions, PanResponder, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const LineGraphWithZoom = ({ chartData }: any) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({
    x: -Dimensions.get('window').width,
    y: 0,
  });

  const handlePanResponderMove = (e, gestureState) => {
    const { dx, dy } = gestureState;
    console.log(Dimensions.get('window').width);
    //  console.log(panPosition.x);
    if (
      panPosition.x <= 0 &&
      panPosition.x >= -Dimensions.get('window').width
    ) {
      setPanPosition((prevPanPosition) => ({
        x: prevPanPosition.x + dx,
        y: prevPanPosition.y + dy,
      }));
    }
  };

  const handlePinchGesture = (e) => {
    setZoomLevel(e.nativeEvent.scale);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: 1000,
          height: 500,
          transform: [{ translateX: panPosition.x }],
        }}
        {...panResponder.panHandlers}
      >
        <LineChart
          data={chartData}
          width={1000}
          height={500}
          withVerticalLines={false}
          onDataPointClick={() => {}}
          withDots={false}
          withHorizontalLines={false}
          chartConfig={{
            backgroundGradientFrom: '#000111', // Black background
            backgroundGradientTo: '#000000', // Dark gray background
            decimalPlaces: 0,
            color: (opacity = 0) => `rgba(255, 100, 20, 1)`, // Red line color
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White label color
            propsForHorizontalLabels: {
              opacity: 0, // Hide the Y-axis line
            },
          }}
          bezier
          withOuterLines={false}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default LineGraphWithZoom;
