import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from './CustomText';
import SoundPlayer from 'react-native-sound-player';

type RootStackParamList = {
  Home: undefined;
  Game: { level: number };
  Topics: undefined;
  Settings: undefined;
  About: undefined;
};

interface NavButtonProps {
  targetPage?: keyof RootStackParamList;
  params?: object;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  soundFile?: { name: string; type: string };
}

const NavButton: React.FC<NavButtonProps> = ({
  targetPage,
  params,
  label,
  style,
  textStyle,
  soundFile,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const handlePress = useCallback(() => {
    const fileToPlay = soundFile || { name: 'general', type: 'mp3' };

    try {
      SoundPlayer.playSoundFile(fileToPlay.name, fileToPlay.type);
    } catch (e) {
      console.warn('SoundPlayer error:', e);
    }

    if (targetPage) navigation.navigate(targetPage, params as never);
  }, [navigation, targetPage, params, soundFile]);

  return (
    <View style={[styles.wrapper, { borderColor: colors.border }]}>
      <Pressable
        onPress={handlePress}
        style={[styles.pressable, style, { borderColor: colors.border }]}
      >
        <CustomText style={[styles.label, textStyle, { color: colors.text }]}>
          {label}
        </CustomText>
      </Pressable>
    </View>
  );
};

export default NavButton;

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 18,
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
