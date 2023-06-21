/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import CoinScreen from './src/screens/CoinScreen';
import { COINS } from './src/utils';
import { DataItem } from './src/types';
import { database } from './src/sqlite-storage/database';
import { connectWebSocket } from './src/web-socket/web-socket';
import {
  RenderPassReport,
  PerformanceProfiler,
} from '@shopify/react-native-performance';

export type RootStackParamList = {
  Home: undefined;
  Coin: {
    coinSymbol: string;
    initialVolume: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
function App(): JSX.Element {
  const formatDuration = (duration: number | undefined): string => {
    if (!duration) return '';
    const seconds = Math.floor(duration / 1000);
    const milliseconds = duration % 1000;
    return `${seconds}s ${milliseconds}ms`;
  };
  const printReport = (report: RenderPassReport): void => {
    console.log('Render Pass Report');
    console.log('Report ID:', report.reportId);
    console.log('Flow Instance ID:', report.flowInstanceId);
    console.log('Source Screen:', report.sourceScreen || 'N/A');
    console.log('Destination Screen:', report.destinationScreen);
    console.log(
      'Flow Start Time:',
      new Date(report.flowStartTimeSinceEpochMillis).toString()
    );
    console.log(
      'Time to Consume Touch Event:',
      report.timeToConsumeTouchEventMillis
        ? formatDuration(report.timeToConsumeTouchEventMillis)
        : 'N/A'
    );

    console.log(
      'Time to Boot JS:',
      report.timeToBootJsMillis
        ? formatDuration(report.timeToBootJsMillis)
        : 'N/A'
    );
    console.log('Render Pass Name:', report.renderPassName || 'N/A');
    console.log(
      'Time to Render:',
      report.timeToRenderMillis
        ? formatDuration(report.timeToRenderMillis)
        : 'N/A'
    );
    console.log(
      'Time to Abort:',
      report.timeToAbortMillis
        ? formatDuration(report.timeToAbortMillis)
        : 'N/A'
    );
    console.log('Interactive:', report.interactive);
  };

  const onReportPrepared = useCallback((report: RenderPassReport) => {
    printReport(report);
  }, []);
  const isDarkMode = useColorScheme() === 'dark';
  const [unmounted, setUnmunted] = useState(false);
  const [appLoad, setAppLoad] = useState<boolean>(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const init = async () => {
    try {
      await database.initialize();
    } catch (err) {
      console.log('SQLite ERROR : err');
    } finally {
      setAppLoad(false);
    }
  };
  useEffect(() => {
    if (unmounted) return;

    init();
    return () => {
      setUnmunted(true);
    };
  }, []);
  if (appLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <PerformanceProfiler onReportPrepared={onReportPrepared}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="Home">
            <RootStack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeScreen}
            />
            <RootStack.Screen
              options={{
                headerShown: true,
                headerBackground: () => (
                  <View
                    style={{
                      backgroundColor: '#000',
                      flex: 1,
                    }}
                  />
                ),
              }}
              name="Coin"
              component={CoinScreen}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PerformanceProfiler>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    fontFamily: 'Courier',
    marginTop: 20,
    marginBottom: 10,
  },
  entry: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.dark,
    fontFamily: 'Courier',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
export default App;
