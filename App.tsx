/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
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
import SQLite from 'react-native-sqlite-storage';
import { database } from './src/sqlite-storage/database';
import { COINS } from './src/utils';
import { DataItem } from './src/types';

// SQLite.openDatabase({
//   name: 'coins.db',
//   location: 'default',
// })
//   .then((db) => {
//     db.executeSql(
//       'CREATE TABLE IF NOT EXISTS myTable (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT, volume TEXT, lastPrice TEXT)',
//       [],
//       () => {
//         console.log('Table created successfully');
//       },
//       (trans, error) => {
//         console.log('Error creating table:', error);
//         if (error.code === 5) {
//           console.log('Table already exists');
//         } else {
//           console.log('Error creating table:', error);
//         }
//       }
//     );
//   })
//   .catch((error) => {
//     console.log('Received error: ', error);
//   });

export type RootStackParamList = {
  Home: undefined;
  Coin: {
    coinSymbol: string;
    initialVolume:string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [unmounted, setUnmunted] = useState(false);
  const [appLoad, setAppLoad] = useState<boolean>(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const init = async () => {
    try {
      await database.initialize();
      // await database.dropAllTables();
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={'Home'}>
          <RootStack.Screen
            options={{ headerShown: true }}
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
