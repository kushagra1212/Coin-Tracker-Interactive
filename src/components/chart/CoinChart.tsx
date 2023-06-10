import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface CoinChartProps {
  coinSymbol: string;
  interval: string;
  limit: number;
}

const CoinChart: React.FC<CoinChartProps> = ({
  coinSymbol,
  interval,
  limit,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  useEffect(() => {
    // Fetch data from Binance API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${coinSymbol}&interval=${interval}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Process the API response data
        const l = data.map((item: any) =>
          new Date(item[0]).toLocaleDateString()
        );
        const d = data.map((item: any) => parseFloat(item[4]));
        setLabels(l);
        setChartData(d);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [coinSymbol, interval, limit]);

  return (
    <View>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default CoinChart;
