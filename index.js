import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import WebSocketConnection from './src/web-socket/WebSocketConnection';
import { connectToDevTools } from 'react-devtools-core';

if (!__DEV__) {
  console.log = () => {};
}

if (__DEV__) {
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
}

const AppWrapper = () => {
  return (
    <>
      <App />
      <WebSocketConnection />
    </>
  );
};

AppRegistry.registerComponent(appName, () => AppWrapper);
