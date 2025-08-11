// components/DevNukeButton.tsx
import React, { useState } from 'react';
import { Alert, ActivityIndicator, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { nukeAndRecreate } from '../db/sqlite';
import CustomText from './CustomText';

type Props = {
  label?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onDone?: () => void; // optional: e.g., refresh UI after nuking
};

const DevNukeButton: React.FC<Props> = ({ label = 'Nuke DB (Dev)', style, textStyle, onDone }) => {
  const { colors } = useTheme();
  const [busy, setBusy] = useState(false);

  const handlePress = () => {
    Alert.alert(
      'Confirm',
      'This will delete the local trivia database and reseed it. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, do it',
          style: 'destructive',
          onPress: async () => {
            try {
              setBusy(true);
              await nukeAndRecreate();
              Alert.alert('Done', 'Database reset and reseeded.');
              onDone?.();
            } catch (e) {
              Alert.alert('Error', String(e));
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={busy ? undefined : handlePress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: pressed ? '#b00020' : '#cf1b1b', borderColor: colors.border },
        style,
      ]}
      android_ripple={{ color: '#00000022' }}
    >
      {busy ? (
        <ActivityIndicator size="small" />
      ) : (
        <CustomText style={[styles.label, { color: colors.card }, textStyle]}>
          {label}
        </CustomText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DevNukeButton;
