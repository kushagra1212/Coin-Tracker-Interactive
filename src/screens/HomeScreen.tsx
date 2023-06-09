import React, {
  useEffect,
  useState,
  useRef,
  ProfilerOnRenderCallback,
  Profiler,
} from 'react';
import { SafeAreaView, AppState, ActivityIndicator } from 'react-native';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ICoin } from '../types';
import performance, {
  PerformanceObserver,
  PerformanceReactNativeMark,
  setResourceLoggingEnabled,
} from 'react-native-performance';
import { getNativeMarkPerformanceLogs } from '../utils';
import CoinList from '../components/CoinList';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
setResourceLoggingEnabled(true);

const traceRender: ProfilerOnRenderCallback = (
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) =>
  performance.measure(id, {
    start: startTime,
    duration: actualDuration,
  });

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  let websocketRef = useRef<WebSocket>();

  const [coinData, setCoinData] = useState<Array<ICoin>>([]);
  const appState = useRef(AppState);
  const [loading, setLoading] = useState(false);

  const [cpuUsage, setCpuUsage] = useState(0);

  // React.useEffect(() => {
  //   // new PerformanceObserver(() => {
  //   //   console.log(
  //   //     performance
  //   //       .getEntriesByType('react-native-mark')
  //   //       .sort(
  //   //         (a: PerformanceReactNativeMark, b: PerformanceReactNativeMark) =>
  //   //           a.startTime - b.startTime,
  //   //       ),
  //   //   );
  //   // }).observe({type: 'react-native-mark', buffered: true});
  //   new PerformanceObserver(() => {
  //     console.log(performance.getEntriesByType('metric'));
  //   }).observe({ type: 'metric', buffered: true });
  //   // new PerformanceObserver(() => {
  //   //   console.log(performance.getEntriesByType('resource'));
  //   // }).observe({type: 'resource', buffered: true});

  //   new PerformanceObserver(() => {
  //     const logs = getNativeMarkPerformanceLogs(
  //       performance
  //         .getEntriesByType('react-native-mark')
  //         .sort(
  //           (a: PerformanceReactNativeMark, b: PerformanceReactNativeMark) =>
  //             a.startTime - b.startTime
  //         )
  //     );
  //     for (let i = 0; i < logs.length; i++) {
  //       console.log(logs[i]);
  //     }
  //     console.log('\n');
  //   }).observe({ type: 'react-native-mark', buffered: true });
  // }, [loading]);

  React.useEffect(() => {
    // @ts-ignore

    fetch('https://xkcd.com/info.0.json', { cache: 'no-cache' });
  }, []);

  const handleSort = (column: string) => {
    // Implement sorting logic based on the selected column
    // Update the coinData state with the sorted data
  };

  const renderItem = ({ item }: { item: ICoin }) => {
    const { s: symbol, c: price, v: volume } = item;

    return (
      <View>
        <Text>{symbol}</Text>
        <Text>{Number(parseFloat(price).toFixed(2))}</Text>
        <Text>{Number(parseFloat(volume).toFixed(2))}</Text>
      </View>
    );
  };

  return (
    <Profiler id="App.render()" onRender={traceRender}>
      <SafeAreaView>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Coin')}>
          <Text
            style={{
              color: 'blue',
              fontSize: 20,
            }}
          >
            See Coin
          </Text>
        </TouchableOpacity> */}
        <CoinList />

        <TouchableOpacity onPress={() => handleSort('price')}>
          <Text>Sort by Price</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSort('volume')}>
          <Text>Sort by Volume</Text>
        </TouchableOpacity>
        {
          loading && (
            <ActivityIndicator />
          ) /* Render a loading indicator while new data is being fetched */
        }
      </SafeAreaView>
    </Profiler>
  );
};

export default HomeScreen;
