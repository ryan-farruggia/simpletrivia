import React, { useEffect, useRef } from 'react';
import {
  Text,
  Linking,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Easing,
  Animated,
  Pressable,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ExternalLinkProps {
  url: string;
  label?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  textValue?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ExternalLink: React.FC<ExternalLinkProps> = ({
  url,
  label,
  buttonStyle,
  textStyle,
  textValue,
}) => {
  const { colors } = useTheme();
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 7000, // ✅ twice as fast
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => {
      loop.stop();
      t.setValue(0);
    };
  }, [t]);

  const backgroundColor = t.interpolate({
    inputRange: [0, 1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 1],
    outputRange: [
      'rgba(255,0,0,0.5)',     // Red
      'rgba(255,127,0,0.5)',   // Orange
      'rgba(255,255,0,0.5)',   // Yellow
      'rgba(0,255,0,0.5)',     // Green
      'rgba(0,0,255,0.5)',     // Blue
      'rgba(75,0,130,0.5)',    // Indigo
      'rgba(139,0,255,0.5)',   // Violet
      'rgba(255,0,0,0.5)',     // Back to Red
    ],
  });

  const handlePress = () => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <View style={[styles.wrapper, { borderColor: colors.border }]}>
      <AnimatedPressable
        onPress={handlePress}
        accessibilityRole="link"
        android_ripple={{ color: '#00000022', borderless: false }}
        style={[
          styles.pressable,
          buttonStyle,
          { borderColor: colors.border, backgroundColor },
        ]}
      >
        <Text style={[styles.label, textStyle, { color: colors.text }]}>
          {textValue ?? label ?? 'Open Link'}
        </Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 4,
  },
  label: {
    fontSize: 36,
    fontFamily: 'Jersey25-Regular',
  },
});

export default ExternalLink;
