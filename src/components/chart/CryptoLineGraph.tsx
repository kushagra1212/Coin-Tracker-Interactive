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
  ActivityIndicator,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Circle, Line } from 'react-native-svg';
import PinchZoom from './PinchZoom';
import { DataItem } from '../../types';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  generateAllTimeLabels,
  generateDailyLabels,
  generateHourlyLabels,
  generateLabelsForAMonthDayWise,
  generateMonthlyLabels,
  generateYearToDateLabels,
  generateYearlyLabels,
  getIntervalandLimit,
  getLabels,
} from '../../utils';
type props = {
  coinSymbol: string;
  initialVolume: string;
};

export interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}
export enum TimeRange {
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
interface IDataItem {
  lastPrice: string;
  symbol: string;
  volume: string;
  closeTime?: string;
  prev: {
    lastPrice: string;
    symbol: string;
    volume: string;
    prev: undefined;
  };
}
const CryptoLineGraph: React.FC<props> = React.memo(
  ({ coinSymbol, initialVolume }) => {
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
    const [latestData, setLatestData] = useState<IDataItem | null>(null);
    const [chartWidth, setChartWidth] = useState(
      Dimensions.get('window').width
    );
    const COIN_SYMBOL = useMemo(
      () => coinSymbol.replace('USDT', '').toLowerCase(),
      [coinSymbol]
    );
    console.log(COIN_SYMBOL);
    const fetchData = async (timeRange: TimeRange) => {
      try {
        // Update with your desired coin symbol

        const { limit, interval } = getIntervalandLimit(timeRange);

        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${coinSymbol}&interval=${interval}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setLatestData({
          lastPrice: data[data.length - 1][4],
          symbol: coinSymbol,
          volume: parseFloat(data[0][5]) === 0.0 ? initialVolume : data[0][5],
          closeTime: data[data.length - 1][6],
          prev: {
            lastPrice: data[0][4],
            symbol: coinSymbol,
            volume: data[0][5],
            prev: undefined,
          },
        });
        const labels = getLabels(timeRange, data);
        //console.log(labels);
        setSelectedTimeRange(timeRange);
        const datasets = [
          { data: data.map((item: any) => parseFloat(item[4])) },
        ];
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
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginLeft: 7,
            backgroundColor:
              selectedTimeRange === timeRange ? COLORS.white : COLORS.blackPure,
            borderRadius: 5,
            borderWidth: 0.2,
            borderColor: COLORS.lightGraySecondary,
            elevation: 5,
          }}
        >
          <Text
            style={[
              FONTS.body3,
              {
                color:
                  selectedTimeRange !== timeRange
                    ? COLORS.GrayPrimary
                    : COLORS.blackPure,
                fontWeight: '700',
              },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    };
    useEffect(() => {
      let unmounted = false;

      if (!unmounted) fetchData(selectedTimeRange);

      return () => {
        unmounted = true;
      };
    }, []);
    if (latestData === null) {
      return <ActivityIndicator />;
    }
    const CoinLineChartHeader = React.memo(() => {
      const formatedLastPrice = parseFloat(latestData.lastPrice).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

      const currentPrice = parseFloat(latestData.lastPrice);
      const previousPrice = parseFloat(latestData.prev?.lastPrice || '0');
      const priceDiff = currentPrice - previousPrice;
      const sign = priceDiff < 0 ? '-' : '+';
      const priceDiffPercentage = (priceDiff / previousPrice) * 100;
      const showChange = previousPrice !== 0;
      const icon = priceDiff < 0 ? 'caretdown' : 'caretup';
      const formattedVolume = parseFloat(latestData.volume).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

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
            backgroundColor: COLORS.blackPure,
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
              {latestData.symbol.replace('USDT', '')} 1 = $ {formatedLastPrice}
            </Text>
            {showChange ? (
              <PriceChangeComponent
                formattedPriceDiffPercentage={formattedPriceDiffPercentage}
                sign={sign}
                icon={icon}
              />
            ) : null}
          </View>
        </View>
      );
    });
    const PriceChangeComponent = React.memo(
      ({ formattedPriceDiffPercentage, icon, sign }: any) => {
        return (
          <View style={{ display: 'flex', marginTop: 5, flexDirection: 'row' }}>
            <Icon
              name={icon}
              size={20}
              color={sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary}
              style={sign !== '-' ? { marginTop: 3 } : {}}
            />
            <Text
              style={[
                {
                  color: COLORS.white,
                  fontWeight: '700',
                },
                FONTS.body3,
              ]}
            >
              {' ' + sign}
              {formattedPriceDiffPercentage}
            </Text>
          </View>
        );
      }
    );
    const FooterComponent = () => {
      const currentPrice = parseFloat(latestData.lastPrice);
      const previousPrice = parseFloat(latestData.prev?.lastPrice || '0');
      const priceDiff = currentPrice - previousPrice;
      const sign = priceDiff < 0 ? '-' : '+';
      const priceDiffPercentage = (priceDiff / previousPrice) * 100;
      const showChange = previousPrice !== 0;
      const icon = priceDiff < 0 ? 'caretdown' : 'caretup';
      const formattedVolume = parseFloat(latestData.volume).toLocaleString();
      console.log(latestData.volume);
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
            alignItems: 'center',
            justifyContent: 'space-around',
            marginVertical: 40,
          }}
        >
          <Image
            source={{
              uri: `https://coinicons-api.vercel.app/api/icon/${COIN_SYMBOL}`,
            }}
            style={{
              width: 60,
              height: 60,
              opacity: 0.9,
            }}
          />
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={styles.header_text}>$ {formattedVolume}</Text>

            {showChange ? (
              <PriceChangeComponent
                formattedPriceDiffPercentage={formattedPriceDiffPercentage}
                sign={sign}
                icon={icon}
              />
            ) : null}
          </View>
        </View>
      );
    };
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.blackPure }}>
        <CoinLineChartHeader />
        {/* Line Chart */}
        {chartData.labels.length ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width}
            height={500}
            withVerticalLines={false}
            onDataPointClick={(data) => {
              setSelectedMonth(data.index);
            }}
            withDots={false}
            withHorizontalLines={false}
            chartConfig={{
              backgroundGradientFrom: '#000111', // Black background
              backgroundGradientTo: '#000000', // Dark gray background
              decimalPlaces: 0,
              color: (opacity = 0) => `rgba(255, 20, 20, 0.5)`, // Red line color
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

        <FooterComponent />

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
  }
);
const styles = StyleSheet.create({
  header_text: {
    ...{ color: COLORS.white, fontWeight: '700' },
    ...FONTS.h1,
  },
});

export default CryptoLineGraph;
