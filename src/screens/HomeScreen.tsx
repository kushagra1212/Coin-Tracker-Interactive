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
import CoinList from '../components/coin/CoinList/CoinList';
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

  return (
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
      <CoinList navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeScreen;
