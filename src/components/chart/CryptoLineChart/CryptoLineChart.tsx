import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ChartData, IDataItem, TimeRange } from '../../../types';
import {
  TIME_RANGE_LIST,
  getIntervalandLimit,
  getLabels,
} from '../../../utils';
import LineGraphSkeleton from '../../Loading/LineChartSekeleton';
import LineGraphWithZoom from '../LineChartWithZoom/LineChartWithZoom ';
import PriceChangeComponent from '../PriceChangeComponent/PriceChangeComponent';
import styles from './styles';
import { PerformanceMeasureView } from '@shopify/react-native-performance';

import { ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BINANCE_API_ENDPOINT,
  COIN_IMAGE_ENDPOINT,
} from '../../../constants/endpoints';
import CryptoLineGraphSekeleton from '../../Loading/CryptoLineChartSekeleton';
import { showMessage } from 'react-native-flash-message';
import { COLORS } from '../../../constants/theme';
type props = {
  coinSymbol: string;
  initialVolume: string;
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const CryptoLineGraph: React.FC<props> = React.memo(
  ({ navigation, coinSymbol, initialVolume }) => {
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

    const [loading, setLoading] = useState<boolean>(false);
    const COIN_SYMBOL = useMemo(
      () => coinSymbol.replace('USDT', '').toLowerCase(),
      [coinSymbol]
    );
    const fetchData = async (timeRange: TimeRange) => {
      try {
        // Update with your desired coin symbol
        setLoading(true);
        const { limit, interval } = getIntervalandLimit(timeRange);

        const response = await fetch(
          `${BINANCE_API_ENDPOINT}?symbol=${coinSymbol}&interval=${interval}&limit=${limit}`
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
        const datasets = [
          { data: data.map((item: any) => parseFloat(item[4])) },
        ];
        setChartData({ labels, datasets });

        setLoading(false);
      } catch (error) {
        showMessage({
          message: 'Network Error',
          description: 'Something went wrong, please try again later',
          type: 'danger',
          duration: 7000,
          icon: 'danger',
          style: {
            borderRadius: 10,
            margin: 10,
            backgroundColor: '#333',
          },
        });
        navigation.navigate('Home');
        console.error('Error fetching data:', error);
      }
    };

    const handleTimeRangeClick = (timeRange: TimeRange) => {
      setSelectedTimeRange(timeRange);

      fetchData(timeRange);
    };

    const renderTimeRangeButton = (timeRange: TimeRange, label: string) => {
      return (
        <TouchableOpacity
          onPress={() => handleTimeRangeClick(timeRange)}
          style={[
            styles.timeRangeButton,
            {
              backgroundColor:
                selectedTimeRange === timeRange
                  ? COLORS.white
                  : COLORS.blackPure,
            },
          ]}
        >
          <Text
            style={[
              styles.timeRangeButtonText,
              {
                color:
                  selectedTimeRange !== timeRange
                    ? COLORS.GrayPrimary
                    : COLORS.blackPure,
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
      return (
        <PerformanceMeasureView interactive={false} screenName="Coin">
          <CryptoLineGraphSekeleton />
        </PerformanceMeasureView>
      );
    }
    const getPriceVariables = () => {
      const currentPrice = parseFloat(latestData.lastPrice);
      const previousPrice = parseFloat(latestData.prev?.lastPrice || '0');
      const priceDiff = currentPrice - previousPrice;
      const sign = priceDiff < 0 ? '-' : '+';
      const priceDiffPercentage = (priceDiff / previousPrice) * 100;
      const showChange = previousPrice !== 0;
      const icon = priceDiff < 0 ? 'caretdown' : 'caretup';

      return {
        priceDiff,
        priceDiffPercentage,
        showChange,
        icon,
        sign,
      };
    };
    const CoinLineChartHeader = React.memo(() => {
      const formatedLastPrice = parseFloat(latestData.lastPrice).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

      const { priceDiff, priceDiffPercentage, showChange, icon, sign } =
        getPriceVariables();

      const formattedPriceDiffPercentage = `${priceDiff
        .toFixed(2)
        .replace('-', '')} (${priceDiffPercentage
        .toFixed(2)
        .toString()
        .replace('-', '')} %)`;

      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
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

    const FooterComponent = () => {
      const { priceDiff, priceDiffPercentage, showChange, icon, sign } =
        getPriceVariables();
      const formattedVolume = parseFloat(latestData.volume).toLocaleString();

      const formattedPriceDiffPercentage = `${priceDiff
        .toFixed(2)
        .replace('-', '')} (${priceDiffPercentage
        .toFixed(2)
        .toString()
        .replace('-', '')} %)`;

      return (
        <View style={styles.footerContainer}>
          <Image
            source={{
              uri: `${COIN_IMAGE_ENDPOINT}/${COIN_SYMBOL}`,
            }}
            style={styles.footerImage}
          />
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>$ {formattedVolume}</Text>

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
      <PerformanceMeasureView interactive={true} screenName="Coin">
        <View style={styles.container}>
          <CoinLineChartHeader />
          {/* Line Chart */}
          {!loading ? (
            <LineGraphWithZoom chartData={chartData} />
          ) : (
            <LineGraphSkeleton
              width={Dimensions.get('window').width}
              height={500}
              duration={500}
              lineColor={`rgba(255, 40, 40, 0.3)`}
            />
          )}
          {/* Time Range Buttons */}
          <View style={styles.timeRangeContainer}>
            <FlatList
              data={TIME_RANGE_LIST}
              renderItem={({ item }) =>
                renderTimeRangeButton(item.value, item.text)
              }
              keyExtractor={(item) => item.value.toString()}
              horizontal
              style={{ marginBottom: 10 }}
            />
          </View>
          <FooterComponent />
        </View>
      </PerformanceMeasureView>
    );
  }
);

export default CryptoLineGraph;
