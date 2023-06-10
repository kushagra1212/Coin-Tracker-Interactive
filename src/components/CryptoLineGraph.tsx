import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Circle, Line } from 'react-native-svg';

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

const CryptoLineGraph: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(3);

  // Your data and labels for the chart
  const chartData: ChartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [
          4261.48, 4689.89, 4378.49, 6463, 9837, 13715.65, 10285.1, 10325.64,
          6922, 9246.01, 7485.01, 6391.08, 7735.67, 7011.21, 6626.57, 6369.52,
          4041.27, 3701.23, 3434.1, 3814.26, 4102.44, 5321.94, 8555, 10854.1,
          10080.53, 9588.74, 8289.97, 9140.86, 7540.63, 7195.24, 9351.71,
          8523.61, 6412.14, 8620, 9448.27, 9138.08, 11335.46, 11649.51,
          10776.59, 13791, 19695.87, 28923.63, 33092.97, 45134.11, 58739.46,
          57697.25, 37253.82, 35045, 41461.84, 47100.89, 43820.01, 61299.81,
          56950.56, 46216.93, 38466.9, 43160, 45510.35, 37630.8, 31801.05,
          19942.21, 23296.36, 20048.44, 19422.61, 20490.74, 17165.53, 16541.77,
          23125.13, 23141.57, 28465.36, 29233.2, 27210.36,
        ],
      },
    ],
  };

  return (
    <View style={{ display: 'flex' }}>
      {/* Line Chart */}
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width}
        height={500}
        withVerticalLines={false}
        onDataPointClick={(data) => {
          console.log(data);
          setSelectedMonth(data.index);
        }}
        withDots={false}
        withHorizontalLines={false}
        chartConfig={{
          backgroundGradientFrom: '#000000', // Black background
          backgroundGradientTo: '#333333', // Dark gray background
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red line color
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White label color
        }}
        bezier
        withOuterLines={false}
      />

      {/* Vertical Line */}
      {selectedMonth !== null && (
        <Svg
          width={Dimensions.get('window').width}
          height={200}
          style={{ position: 'absolute' }}
        >
          <Line
            x1={
              (Dimensions.get('window').width / chartData.labels.length) *
              selectedMonth
            }
            y1={0}
            x2={
              (Dimensions.get('window').width / chartData.labels.length) *
              selectedMonth
            }
            y2={200}
            stroke="white"
            strokeWidth={2}
          />
          <Circle
            cx={
              (Dimensions.get('window').width / chartData.labels.length) *
              selectedMonth
            }
            cy={100}
            r={6}
            fill="white"
          />
        </Svg>
      )}
    </View>
  );
};

export default CryptoLineGraph;
