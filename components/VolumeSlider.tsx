import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import CustomText from './CustomText';
import { useTheme } from '@react-navigation/native';

type Props = {
  label: string;
  value: number;                 // 0..1
  onChange: (v: number) => void;
  onPreview?: () => void;        // play a short SFX while sliding
  previewThrottleMs?: number;    // default 150ms
  /** Optional style overrides */
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  sliderStyle?: ViewStyle;
  valueStyle?: TextStyle;
};

const VolumeSlider: React.FC<Props> = ({
  label,
  value,
  onChange,
  onPreview,
  previewThrottleMs = 150,
  containerStyle,
  labelStyle,
  sliderStyle,
  valueStyle,
}) => {
  const pct = Math.round(value * 100);
  const lastPreviewRef = useRef(0);
  const { colors } = useTheme();

  const handleValueChange = (v: number) => {
    onChange(v);
    if (!onPreview) return;
    const now = Date.now();
    if (now - lastPreviewRef.current >= previewThrottleMs) {
      lastPreviewRef.current = now;
      onPreview();
    }
  };

  const handleSlidingComplete = () => {
    onPreview?.();
  };

  return (
    <View style={[styles.row, containerStyle]}>
      <CustomText style={[styles.label, { color: colors.text }, labelStyle]}>
        {label}
      </CustomText>
      <Slider
        style={[styles.slider, sliderStyle]}
        value={value}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
      />
      <CustomText style={[styles.value, { color: colors.text }, valueStyle]}>
        {pct}%
      </CustomText>
    </View>
  );
};

export default VolumeSlider;

const styles = StyleSheet.create({
  row: { width: '100%', marginBottom: 10 },
  label: { fontSize: 28, marginBottom: 8, fontFamily: 'Jersey25-Regular' },
  slider: { width: '100%', height: 40 },
  value: { marginTop: 6, fontSize: 24 },
});
