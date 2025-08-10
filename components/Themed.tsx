// components/Themed.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

export const ThemedView: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { colors } = useTheme();
  return <View style={[{ backgroundColor: colors.background }, style]} {...rest} />;
};
