/**
 * @format
 */

// index.js (project root) — ensure this exists and registers the service
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
