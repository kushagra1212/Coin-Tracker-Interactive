/**
 * @format
 */
import { LogBox } from 'react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import WebSocketConnection from './src/web-socket/WebSocketConnection';
const AppWrapper = () => (
  <>
    <WebSocketConnection />
    <App />
  </>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
if (!__DEV__) {
  console.log = () => {};
}
