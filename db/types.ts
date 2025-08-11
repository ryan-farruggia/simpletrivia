// db/types.ts
export type Row = {
  id: string;
  topic: string;       // e.g., 'math'|'science'... (use consistent casing across your dataset)
  difficulty: string;  // 'easy'|'medium'|'hard'|'impossible'
  prompt: string;
  a1: string; a2: string; a3: string; a4: string;
  correct_index: number; // 0..3
};
