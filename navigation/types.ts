// navigation/types.ts

export type TopicKey =
  | 'Math'
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Literature'
  | 'Technology'
  | 'Sports'
  | 'VideoGames'
  | 'TVMovies';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export type GameSetup = {
  topic?: TopicKey;
  difficulty?: Difficulty;
  count?: number;
};

// Root navigator (App.tsx)
export type RootStackParamList = {
  Home: undefined;
  Game: { level: number }; // keep your existing param shape
  Topics: undefined;       // nested topics flow mounted here
  Settings: undefined;
  About: undefined;
};

// Nested Topics navigator
export type TopicsStackParamList = {
  TopicList: undefined;
  Difficulty: { topic: TopicKey };
  QuestionCount: { topic: TopicKey; difficulty: Difficulty };
};
