import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, ToastAndroid } from 'react-native';
import { useTheme, useNavigation, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SoundPlayer from 'react-native-sound-player';
import CustomText from '../components/CustomText';
import NavButton from '../components/NavButton';
import { useGameSetup } from '../state/GameSetupContext';
import type { Difficulty, TopicKey } from '../navigation/types';
import { loadQuestions, type Row as DBRow } from '../db/sqlite';

type Question = {
  id: string;
  topic: TopicKey;
  difficulty: Difficulty;
  prompt: string;
  answers: string[];
  correctIndex: number;
};

type Outcome = 'playing' | 'won' | 'lost';

export default function GameScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setup, reset } = useGameSetup();

  // ⬇️ move the ref INSIDE the component
  const exitTargetRef = useRef<'home' | null>(null);

  const ready = useMemo(
    () => !!setup.topic && !!setup.difficulty && !!setup.count,
    [setup]
  );

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>('playing');
  const [lives, setLives] = useState(3);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const lastCorrectIndexRef = useRef<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ready) {
      // If we just chose to exit to Home, don't redirect to Topics.
      if (exitTargetRef.current === 'home') {
        exitTargetRef.current = null; // consume the intent
        return;
      }
      navigation.dispatch(
        CommonActions.navigate({ name: 'Topics', params: { screen: 'TopicList' } })
      );
      return;
    }

    let isMounted = true;
    setLoading(true);
    setOutcome('playing');
    setIndex(0);
    setLives(3);
    setSelectedIndex(null);
    setWasCorrect(null);

    const desiredCount = Math.max(1, Math.min(100, Math.floor(Number(setup.count) || 10)));

    const dbg = (m: string) => ToastAndroid.show(m, ToastAndroid.LONG);

    dbg(`Params → topic=${setup.topic}, diff=${setup.difficulty}, count=${desiredCount}`);
    // Alert.alert('DEBUG', `topic=${setup.topic}\ndiff=${setup.difficulty}\ncount=${desiredCount}`);

    loadQuestions(setup.topic!, setup.difficulty!, desiredCount)
      .then((rows: DBRow[]) => {
        dbg(`Loaded rows=${rows.length}`);
        // Alert.alert('DEBUG', `rows.length=${rows.length}`);

        const mapped: Question[] = rows.map(r => ({
          id: r.id,
          topic: r.topic as TopicKey,
          difficulty: r.difficulty as Difficulty,
          prompt: r.prompt,
          answers: [r.a1, r.a2, r.a3, r.a4],
          correctIndex: r.correct_index,
        }));
        setQuestions(mapped);
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
    };
  }, [ready, setup?.topic, setup?.difficulty, setup?.count, navigation]);

  const current = questions[index];

  const playSfx = (name: 'positive' | 'negative') => {
    try {
      SoundPlayer.playSoundFile(name, 'mp3');
    } catch (e) {
      console.warn('SFX error:', e);
    }
  };

  const handleAnswer = (choice: number) => {
    if (!current || outcome !== 'playing') return;
    if (selectedIndex !== null) return;

    const correct = current.correctIndex;
    lastCorrectIndexRef.current = correct;

    const isRight = choice === correct;
    setSelectedIndex(choice);
    setWasCorrect(isRight);
    playSfx(isRight ? 'positive' : 'negative');

    advanceTimer.current = setTimeout(() => {
      if (!isRight) {
        setLives(prev => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setOutcome('lost');
          }
          return nextLives;
        });
      }

      if (isRight || lives - 1 > 0) {
        if (index + 1 < questions.length) {
          setIndex(i => i + 1);
          setSelectedIndex(null);
          setWasCorrect(null);
        } else {
          if (lives - (isRight ? 0 : 1) > 0) {
            setOutcome('won');
          } else {
            setOutcome('lost');
          }
        }
      }

      advanceTimer.current = null;
    }, 750);
  };

  // Single "go home" handler used everywhere — now with full stack RESET
  const goToHome = () => {
    exitTargetRef.current = 'home';
    setSelectedIndex(null);
    setWasCorrect(null);
    setOutcome('playing');
    setLives(3);
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  if (!ready) return null;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <ActivityIndicator />
        <CustomText style={[styles.loading, { color: colors.text }]}>Loading questions…</CustomText>
      </View>
    );
  }

  if (!current && questions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <CustomText style={[styles.title, { color: colors.text }]}>
          No questions found for your selection.
        </CustomText>
        <NavButton label="Back to Home" onPress={goToHome} />
      </View>
    );
  }

  if (outcome === 'won') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <CustomText style={[styles.title, { color: colors.text }]}>You Win!</CustomText>
        <CustomText style={[styles.meta, { color: colors.text }]}>
          {setup.topic} • {setup.difficulty} • {questions.length}/{questions.length}
        </CustomText>
        <CustomText style={[styles.meta, { color: colors.text }]}>
          Lives left: {lives}
        </CustomText>
        <NavButton label="Back to Home" onPress={goToHome} />
      </View>
    );
  }

  if (outcome === 'lost') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
        <CustomText style={[styles.title, { color: colors.text }]}>Game Over</CustomText>
        {lastCorrectIndexRef.current !== null && (
          <CustomText style={[styles.meta, { color: colors.text }]}>
            Correct answer: {['A', 'B', 'C', 'D'][lastCorrectIndexRef.current]}
          </CustomText>
        )}
        <NavButton label="Back to Home" onPress={goToHome} />
      </View>
    );
  }

  const livesBar = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <CustomText style={[styles.meta, { color: colors.text }]}>
        {setup.topic} • {setup.difficulty} • {index + 1}/{questions.length}
      </CustomText>
      <CustomText style={[styles.meta, { color: colors.text }]}>
        Lives: {livesBar}
      </CustomText>

      <CustomText style={[styles.prompt, { color: colors.text }]}>
        {current?.prompt}
      </CustomText>

      <View style={styles.answers}>
        {current?.answers.map((ans, i) => {
          const isSelected = selectedIndex === i;
          const bg =
            isSelected && wasCorrect === true ? '#32CD32' :
            isSelected && wasCorrect === false ? '#FF3B30' :
            'transparent';

          return (
            <Pressable
              key={i}
              onPress={() => handleAnswer(i)}
              disabled={selectedIndex !== null}
              style={[
                styles.answerBtn,
                { borderColor: colors.border, backgroundColor: bg },
              ]}
            >
              <CustomText style={[styles.answerText, { color: colors.text }]}>{ans}</CustomText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <NavButton label="Quit" onPress={goToHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loading: {
    marginTop: 12,
    fontSize: 20,
    fontFamily: 'Jersey25-Regular',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 8,
    fontFamily: 'Jersey25-Regular',
    textAlign: 'center',
  },
  prompt: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'Jersey25-Regular',
  },
  answers: {
    gap: 12,
    marginTop: 8,
    width: '100%',
    maxWidth: 500,
  },
  answerBtn: {
    borderWidth: 3,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 22,
    fontFamily: 'Jersey25-Regular',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
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
