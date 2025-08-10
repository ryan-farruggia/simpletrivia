import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  Theme as NavTheme,
} from '@react-navigation/native';

type Mode = 'light' | 'dark';
type AppColors = {
  // semantic tokens you’ll use everywhere
  bg: string;        // page background
  text: string;      // default text
  card: string;      // surfaces/cards
  border: string;    // borders, outlines
  primary: string;   // brand/cta
  muted: string;     // secondary text
};

type AppTheme = {
  mode: Mode;
  colors: AppColors;
  navTheme: NavTheme;     // for NavigationContainer/useTheme()
};

const STORE_KEY = 'settings.darkMode';

const lightColors: AppColors = {
  bg: '#d7d7d7',
  text: '#333333',
  card: '#ffffff',
  border: '#484848',
  primary: '#1e96fc',
  muted: '#666666',
};

const darkColors: AppColors = {
  bg: '#121212',
  text: '#f5f5f5',
  card: '#1e1e1e',
  border: '#333333',
  primary: '#1e96fc',
  muted: '#aaaaaa',
};

// adapt React Navigation’s theme so its built‑ins (headers, etc.) match
const makeNavTheme = (c: AppColors, base: NavTheme): NavTheme => ({
  ...base,
  colors: {
    ...base.colors,
    background: c.bg,
    text: c.text,
    card: c.card,
    border: c.border,
    primary: c.primary,
    notification: c.primary,
  },
});

const ThemeCtx = createContext<{ theme: AppTheme; setMode: (m: Mode) => void } | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORE_KEY);
      if (saved) setMode(saved === 'true' ? 'dark' : 'light');
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORE_KEY, String(mode === 'dark'));
  }, [mode]);

  const colors = mode === 'dark' ? darkColors : lightColors;
  const navTheme = useMemo(
    () => makeNavTheme(colors, mode === 'dark' ? NavDark : NavLight),
    [mode]
  );

  const theme = useMemo<AppTheme>(() => ({ mode, colors, navTheme }), [mode, colors, navTheme]);
  return <ThemeCtx.Provider value={{ theme, setMode }}>{children}</ThemeCtx.Provider>;
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
};
