import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '@react-navigation/native';

type Props = {
  value: boolean;                 // true = dark, false = light
  onChange: (v: boolean) => void;
};

const ThemeToggle: React.FC<Props> = ({ value, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <CustomText style={[styles.label, { color: colors.text }]}>Dark Mode</CustomText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.primary : colors.card}
      />
    </View>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  label: { fontSize: 28, fontFamily: 'Jersey25-Regular' },
});
