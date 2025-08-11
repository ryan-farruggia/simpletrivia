// data/questions.ts
import type { TopicKey, Difficulty } from '../navigation/types';

export type Question = {
  id: string;
  topic: TopicKey;
  difficulty: Difficulty;
  prompt: string;
  answers: string[];     // Multiple choice options
  correctIndex: number;  // Index of the correct answer in the answers array
};

export const QUESTIONS: Question[] = [
  // Math - Easy
  {
    id: 'math-easy-1',
    topic: 'Math',
    difficulty: 'easy',
    prompt: 'What is 2 + 2?',
    answers: ['3', '4', '5', '6'],
    correctIndex: 1,
  },
  {
    id: 'math-easy-2',
    topic: 'Math',
    difficulty: 'easy',
    prompt: 'What is 10 - 4?',
    answers: ['6', '5', '4', '7'],
    correctIndex: 0,
  },

  // Science - Medium
  {
    id: 'science-medium-1',
    topic: 'Science',
    difficulty: 'medium',
    prompt: 'What is the chemical symbol for gold?',
    answers: ['Ag', 'Au', 'Gd', 'Go'],
    correctIndex: 1,
  },

  // History - Hard
  {
    id: 'history-hard-1',
    topic: 'History',
    difficulty: 'hard',
    prompt: 'Who was the first emperor of Rome?',
    answers: ['Julius Caesar', 'Augustus', 'Nero', 'Tiberius'],
    correctIndex: 1,
  },

  // Technology - Impossible
  {
    id: 'technology-impossible-1',
    topic: 'Technology',
    difficulty: 'impossible',
    prompt: 'In what year was the first 1-terabyte hard drive released to consumers?',
    answers: ['2005', '2007', '2008', '2010'],
    correctIndex: 2,
  },
];
