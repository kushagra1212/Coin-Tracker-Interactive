import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Circle, Line } from 'react-native-svg';
import PinchZoom from './PinchZoom';
import { DataItem } from '../../types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/AntDesign';
type props = {
  coin: DataItem;
};

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

const TIME_RANGE_LIST = [
  { text: 'Today', value: TimeRange.TODAY },
  { text: 'Week', value: TimeRange.WEEK },
  { text: '1 Month', value: TimeRange.ONE_MONTH },
  { text: '6 Months', value: TimeRange.SIX_MONTH },
  { text: 'YTD', value: TimeRange.YEAR_TO_DATE },
  { text: '1 Year', value: TimeRange.ONE_YEAR },
  { text: '5 Years', value: TimeRange.FIVE_YEARS },
  { text: 'All Time', value: TimeRange.ALL_TIME },
];

const CryptoLineGraph: React.FC<props> = React.memo(({ coin }) => {
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
  const CoinLineChartHeader = () => {
    const formatedLastPrice = parseFloat(coin.lastPrice).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    const currentPrice = parseFloat(coin.lastPrice);
    const previousPrice = parseFloat(coin.prev?.lastPrice || '0');
    const priceDiff = currentPrice - previousPrice;
    const sign = priceDiff < 0 ? '-' : '+';
    const priceDiffPercentage = (priceDiff / previousPrice) * 100;
    const showChange = previousPrice !== 0;
    const icon = priceDiff < 0 ? 'caretdown' : 'caretup';
    const formattedVolume = parseFloat(coin.volume).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedPriceDiffPercentage = `${priceDiff
      .toFixed(2)
      .replace('-', '')} (${priceDiffPercentage
      .toFixed(2)
      .toString()
      .replace('-', '')} %)`;

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 100,
          backgroundColor: COLORS.black,
          padding: 5,
          paddingLeft: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <Text style={styles.header_text}>
            {coin.symbol.replace('USDT', '')} 1 = $ {formatedLastPrice}
          </Text>
          {showChange ? (
            <Text
              style={[
                {
                  color: COLORS.white,
                  fontWeight: '700',
                },
                FONTS.body3,
              ]}
            >
              <Icon
                name={icon}
                size={20}
                color={sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary}
              />
              {' ' + sign}
              {formattedPriceDiffPercentage}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <View style={{ display: 'flex', backgroundColor: 'blue' }}>
      <CoinLineChartHeader />
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
      {/* Time Range Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <FlatList
          data={TIME_RANGE_LIST}
          renderItem={({ item }) =>
            renderTimeRangeButton(item.value, item.text)
          }
          keyExtractor={(item) => item.value}
          horizontal
          style={{ marginBottom: 10 }}
        />
      </View>
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
  );
});
const styles = StyleSheet.create({
  header_text: {
    ...{ color: COLORS.white, fontWeight: '700' },
    ...FONTS.h1,
  },
});

export default CryptoLineGraph;
