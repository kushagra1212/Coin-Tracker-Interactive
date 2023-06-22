import { useCallback, useEffect, useRef, useState } from 'react';
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
import { formatDuration } from './src/utils';
import { database } from './src/sqlite-storage/database';
import {
  RenderPassReport,
  PerformanceProfiler,
} from '@shopify/react-native-performance';
import FlashMessage from 'react-native-flash-message';

import PerformanceComponent, {
  IRef,
} from './src/components/common/PerformanceComponent';
import { RootStackParamList } from './src/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const childRef = useRef<IRef>(null);
  const errorHandler = useCallback((error: Error) => {}, []);
  const isDarkMode = useColorScheme() === 'dark';

  const [appLoad, setAppLoad] = useState<boolean>(true);
  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };

  const printReport = (report: RenderPassReport): void => {
    if (childRef.current) {
      childRef.current.timeToRenderHandler(
        formatDuration(report.timeToRenderMillis)
      );
    }
  };

  const onReportPrepared = useCallback((report: RenderPassReport) => {
    printReport(report);
  }, []);

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
    let unmounted = false;
    if (!unmounted) init();
    return () => {
      unmounted = true;
    };
  }, []);
  useEffect(() => {
    // if (!appLoad) SplashScreen.hide();
  }, [appLoad]);
  if (appLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <PerformanceProfiler
      onReportPrepared={onReportPrepared}
      errorHandler={errorHandler}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <PerformanceComponent ref={childRef} />
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
      <FlashMessage position="bottom" />
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
