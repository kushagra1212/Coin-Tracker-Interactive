import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Circle, Line } from 'react-native-svg';
import PinchZoom from './PinchZoom';

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

enum TimeRange {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  ONE_MONTH = 'ONE_MONTH',
  SIX_MONTH = 'SIX_MONTH',
  YEAR_TO_DATE = 'YEAR_TO_DATE',
  ONE_YEAR = 'ONE_YEAR',
  FIVE_YEARS = 'FIVE_YEARS',
  ALL_TIME = 'ALL_TIME',
}

const CryptoLineGraph: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    TimeRange.TODAY
  );
  const [chartWidth, setChartWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    fetchData(TimeRange.ONE_YEAR);
  }, []);

  const fetchData = async (timeRange: TimeRange) => {
    try {
      const coinSymbol = 'BTCUSDT'; // Update with your desired coin symbol
      let interval = '1d'; // Default interval for most time ranges
      let limit = 365; // Default limit for most time ranges

      switch (timeRange) {
        case TimeRange.TODAY:
          limit = 1440; // Fetch data for the last 24 hours (1 minute intervals)
          interval = '1m';
          break;
        case TimeRange.WEEK:
          limit = 7; // Fetch data for the last 7 days
          interval = '1d';
          break;
        case TimeRange.ONE_MONTH:
          limit = 30; // Fetch data for the last 30 days
          interval = '1d';
          break;
        case TimeRange.SIX_MONTH:
          limit = 180; // Fetch data for the last 6 months
          interval = '1d';
          break;
        case TimeRange.YEAR_TO_DATE:
          const currentDate = new Date();
          const yearStart = new Date(currentDate.getFullYear(), 0, 1);
          const daysPassed = Math.floor(
            (currentDate.getTime() - yearStart.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          limit = daysPassed + 1; // Fetch data from the start of the year till today
          interval = '1d';
          break;
        case TimeRange.ONE_YEAR:
          limit = 365; // Fetch data for the last 1 year
          interval = '1d';
          break;
        case TimeRange.FIVE_YEARS:
          limit = 365 * 5; // Fetch data for the last 5 years
          interval = '1w';
          break;
        case TimeRange.ALL_TIME:
          limit = 0; // Fetch all available data
          interval = '1w';
          break;
        default:
          break;
      }

      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${coinSymbol}&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      // Process the API response data
      const labels = data.map((item: any) =>
        new Date(item[0]).toLocaleDateString()
      );
      const datasets = [{ data: data.map((item: any) => parseFloat(item[4])) }];
      setChartData({ labels, datasets });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTimeRangeClick = (timeRange: TimeRange) => {
    fetchData(timeRange);
  };

  const renderTimeRangeButton = (timeRange: TimeRange, label: string) => {
    return (
      <TouchableOpacity
        onPress={() => handleTimeRangeClick(timeRange)}
        style={{
          padding: 10,
          backgroundColor:
            selectedTimeRange === timeRange ? 'blue' : 'lightblue',
        }}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  };
  const distance = new Animated.Value(100);

  return (
    <PinchZoom distance={distance}>
      <View style={{ display: 'flex', backgroundColor: 'blue' }}>
        {/* Time Range Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          {renderTimeRangeButton(TimeRange.TODAY, 'Today')}
          {renderTimeRangeButton(TimeRange.WEEK, 'Week')}
          {renderTimeRangeButton(TimeRange.ONE_MONTH, '1 Month')}
          {renderTimeRangeButton(TimeRange.SIX_MONTH, '6 Months')}
          {renderTimeRangeButton(TimeRange.YEAR_TO_DATE, 'Year to Date')}
          {renderTimeRangeButton(TimeRange.ONE_YEAR, '1 Year')}
          {renderTimeRangeButton(TimeRange.FIVE_YEARS, '5 Years')}
          {renderTimeRangeButton(TimeRange.ALL_TIME, 'All Time')}
        </View>
        {/* Line Chart */}
        {chartData.labels.length ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width}
            height={400}
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
              width: Dimensions.get('window').width,
              propsForHorizontalLabels: {
                opacity: 0, // Hide the Y-axis line
              },
            }}
            bezier
            withOuterLines={false}
            style={{
              marginLeft: -16, // Adjust chart positioning to align with the X-axis labels
              backgroundColor: 'blue',
            }}
          />
        ) : null}
        {/* Vertical Line */}
        {/* {selectedMonth !== null && (
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
      )} */}
      </View>
    </PinchZoom>
  );
};

export default CryptoLineGraph;
