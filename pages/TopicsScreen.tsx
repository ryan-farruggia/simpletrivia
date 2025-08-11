import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomText from '../components/CustomText';
import NavButton from '../components/NavButton';
import { useGameSetup } from '../state/GameSetupContext';
import type { TopicsStackParamList, TopicKey } from '../navigation/types';

type Nav = NativeStackNavigationProp<TopicsStackParamList, 'TopicList'>;

const TOPICS: Array<{ label: string; key: TopicKey }> = [
  { label: 'Math', key: 'Math' },
  { label: 'Science', key: 'Science' },
  { label: 'History', key: 'History' },
  { label: 'Geography', key: 'Geography' },
  { label: 'Literature', key: 'Literature' },
  { label: 'Technology', key: 'Technology' },
  { label: 'Sports', key: 'Sports' },
  { label: 'Video Games', key: 'VideoGames' },
  { label: 'TV & Movies', key: 'TVMovies' },
];

const TopicsScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { setTopic } = useGameSetup();

  // lock + fade-in
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

  const chooseTopic = (topic: TopicKey) => {
    if (locked) return;
    setTopic(topic);
    navigation.navigate('Difficulty', { topic });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      <CustomText style={[styles.title, { color: colors.text }]}>
        Choose a Topic
      </CustomText>

      <Animated.View style={[styles.buttons, { opacity: fade }]}>
        {TOPICS.map(t => (
          <NavButton key={t.key} label={t.label} onPress={() => chooseTopic(t.key)} />
        ))}

        <NavButton
          label="Back to Home"
          onPress={() => {
            if (locked) return;
            navigation.getParent()?.navigate('Home');
          }}
          style={{ borderColor: colors.border }}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    rowGap: 0,
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
  buttons: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    rowGap: 0,
  },
});

export default TopicsScreen;
