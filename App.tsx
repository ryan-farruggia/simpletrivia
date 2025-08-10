import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImmersiveMode from 'react-native-immersive-mode';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './pages/HomeScreen';
import GameScreen from './pages/GameScreen';
import SettingsScreen from './pages/SettingsScreen';
import AboutScreen from './pages/AboutScreen';
import TopicsScreen from './pages/TopicsScreen';
import { ThemeProvider, useAppTheme } from './theme/ThemeProvider';

type RootStackParamList = {
  Home: undefined;
  Game: { level: number };
  Topics: undefined;
  Settings: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNav = () => {
  const { theme } = useAppTheme();
  return (
    <NavigationContainer theme={theme.navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Topics" component={TopicsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode('FullSticky');
    return () => {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarMode('Normal');
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNav />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7d7d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
