// components/Hr.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Props = {
  inset?: number;          // left+right margin
  thickness?: number;      // line thickness
  color?: string;          // override theme color
  opacity?: number;        // 0..1 (ignored if color is provided)
  dashed?: boolean;        // dashed vs solid
  style?: ViewStyle;       // container style
};

const Hr: React.FC<Props> = ({
  inset = 0,
  thickness,
  color,
  opacity = 0.2,
  dashed = false,
  style,
}) => {
  const { colors } = useTheme() as { colors: Record<string, string> };

  // Prefer a custom theme key if you have one (e.g., colors.separator),
  // else fall back to border, then text.
  const themeColor =
    color ??
    colors.separator ??
    colors.border ??
    colors.text;

  return (
    <View
      style={[styles.container, { marginHorizontal: inset }, style]}
      pointerEvents="none"
      accessible={false}
    >
      <View
        style={{
          borderBottomWidth: thickness ?? StyleSheet.hairlineWidth,
          borderBottomColor: themeColor,
          borderStyle: dashed ? 'dashed' : 'solid',
          opacity: color ? 1 : opacity,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    marginVertical: 8,
  },
});

export default Hr;
