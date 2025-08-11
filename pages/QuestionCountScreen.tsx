import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TopicsStackParamList } from '../navigation/types';
import { useGameSetup } from '../state/GameSetupContext';
import CustomText from '../components/CustomText';
import NavButton from '../components/NavButton';

type Props = NativeStackScreenProps<TopicsStackParamList, 'QuestionCount'>;

export default function QuestionCountScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { setCount } = useGameSetup();
  const { topic, difficulty } = route.params;

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

  const pickCount = (count: number) => {
    if (locked) return;
    setCount(count);
    navigation.getParent()?.navigate('Game', { level: 1 });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 16 },
      ]}
    >
      <CustomText style={[styles.title, { color: colors.text }]}>
        How Many Questions?
      </CustomText>

      <Animated.View style={{ width: '100%', maxWidth: 520, opacity: fade }}>
        <NavButton label="10 Questions" onPress={() => pickCount(10)} />
        <NavButton label="20 Questions" onPress={() => pickCount(20)} />
        <NavButton label="50 Questions" onPress={() => pickCount(50)} />

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
