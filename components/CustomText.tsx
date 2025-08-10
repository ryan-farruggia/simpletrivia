import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const CustomText: React.FC<TextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  const flat = StyleSheet.flatten(style) || {};
  const color = (flat as any).color ?? colors.text;
  return <Text style={[styles.base, style, { color }]} {...props} />;
};

const styles = StyleSheet.create({ base: { fontFamily: 'Jersey25-Regular' } });
export default CustomText;
