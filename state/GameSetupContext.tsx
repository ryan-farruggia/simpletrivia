// state/GameSetupContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameSetup, TopicKey, Difficulty } from '../navigation/types';

type Action =
  | { type: 'setTopic'; topic: TopicKey }
  | { type: 'setDifficulty'; difficulty: Difficulty }
  | { type: 'setCount'; count: number }
  | { type: 'reset' }
  | { type: 'hydrate'; value: GameSetup };

type State = GameSetup;

const initialState: State = {};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTopic':
      return { ...state, topic: action.topic };
    case 'setDifficulty':
      return { ...state, difficulty: action.difficulty };
    case 'setCount':
      return { ...state, count: action.count };
    case 'reset':
      return {};
    case 'hydrate':
      return { ...state, ...action.value };
    default:
      return state;
  }
}

const GameSetupContext = createContext<{
  setup: State;
  setTopic: (t: TopicKey) => void;
  setDifficulty: (d: Difficulty) => void;
  setCount: (n: number) => void;
  reset: () => void;
}>({} as any);

const STORAGE_KEY = '@gameSetup';

export const GameSetupProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [setup, dispatch] = useReducer(reducer, initialState);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          dispatch({ type: 'hydrate', value: JSON.parse(raw) });
        }
      } catch (err) {
        console.error('Failed to load game setup', err);
      }
    })();
  }, []);

  // Save to storage on change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
      } catch (err) {
        console.error('Failed to save game setup', err);
      }
    })();
  }, [setup]);

  const value = useMemo(
    () => ({
      setup,
      setTopic: (topic: TopicKey) =>
        dispatch({ type: 'setTopic', topic }),
      setDifficulty: (difficulty: Difficulty) =>
        dispatch({ type: 'setDifficulty', difficulty }),
      setCount: (count: number) =>
        dispatch({ type: 'setCount', count }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [setup]
  );

  return (
    <GameSetupContext.Provider value={value}>
      {children}
    </GameSetupContext.Provider>
  );
};

export const useGameSetup = () => useContext(GameSetupContext);
