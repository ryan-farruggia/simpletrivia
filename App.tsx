// App.tsx
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
import { ThemeProvider, useAppTheme } from './theme/ThemeProvider';
import { RootStackParamList } from './navigation/types';
import TopicsNavigator from './navigation/TopicsNavigator';
import { GameSetupProvider } from './state/GameSetupContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNav = () => {
  const { theme } = useAppTheme();

  return (
    <NavigationContainer theme={theme.navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Topics" component={TopicsNavigator} />
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
        <GameSetupProvider>
          <RootNav />
        </GameSetupProvider>
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
