import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TopicsStackParamList, Difficulty } from '../navigation/types';
import { useGameSetup } from '../state/GameSetupContext';
import CustomText from '../components/CustomText';
import NavButton from '../components/NavButton';

type Props = NativeStackScreenProps<TopicsStackParamList, 'Difficulty'>;

export default function DifficultyScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { setDifficulty } = useGameSetup();
  const { topic } = route.params;

  const [locked, setLocked] = useState(true);
  const fade = useRef(new Animated.Value(0.6)).current;

  useFocusEffect(
    useCallback(() => {
      setLocked(true);
      fade.setValue(0.1);
      const anim = Animated.timing(fade, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      });
      anim.start(() => setLocked(false));
      return () => {
        fade.stopAnimation();
      };
    }, [fade])
  );

  const pickDifficulty = (difficulty: Difficulty) => {
    if (locked) return;
    setDifficulty(difficulty);
    navigation.navigate('QuestionCount', { topic, difficulty });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 16 },
      ]}
    >
      <CustomText style={[styles.title, { color: colors.text }]}>
        Choose Difficulty
      </CustomText>

      <Animated.View style={{ width: '100%', maxWidth: 520, opacity: fade }}>
        <NavButton label="Easy" onPress={() => pickDifficulty('easy')} />
        <NavButton label="Medium" onPress={() => pickDifficulty('medium')} />
        <NavButton label="Hard" onPress={() => pickDifficulty('hard')} />
        <NavButton label="Impossible" onPress={() => pickDifficulty('impossible')} />

        <NavButton
          label="Back"
          onPress={() => {
            if (locked) return;
            navigation.goBack();
          }}
          style={{ borderColor: colors.border }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Jersey25-Regular',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 20,
    marginBottom: 16,
  },
});
