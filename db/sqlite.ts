// db/sqlite.ts
import SQLite, { type SQLiteDatabase } from 'react-native-sqlite-storage';
import { seedQuestions } from './seed';

SQLite.enablePromise(true);

const DB_NAME = 'trivia.db'; // bump this name to force a fresh DB if needed

export type Row = {
  id: string;
  topic: string;
  difficulty: string;
  prompt: string;
  a1: string; a2: string; a3: string; a4: string;
  correct_index: number; // 0..3
};

let dbRef: SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLiteDatabase> {
  if (dbRef) return dbRef;
  dbRef = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  await ensureSchema(dbRef);
  await ensureSeed(dbRef);
  return dbRef;
}

async function ensureSchema(db: SQLiteDatabase) {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      prompt TEXT NOT NULL,
      a1 TEXT NOT NULL,
      a2 TEXT NOT NULL,
      a3 TEXT NOT NULL,
      a4 TEXT NOT NULL,
      correct_index INTEGER NOT NULL CHECK(correct_index BETWEEN 0 AND 3)
    );
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_questions_topic_diff
    ON questions(topic, difficulty);
  `);

  // simple schema version (bump when you change schema)
  await db.executeSql(
    `INSERT OR REPLACE INTO _meta (key, value) VALUES ('schema_version', ?)`,
    ['1']
  );
}

async function ensureSeed(db: SQLiteDatabase) {
  const [res] = await db.executeSql(`SELECT COUNT(*) AS c FROM questions`);
  const count = (res.rows.item(0).c as number) ?? 0;
  if (count > 0) return; // already populated

  if (!seedQuestions || seedQuestions.length === 0) return;

  await db.transaction(async tx => {
    const sql = `
      INSERT OR IGNORE INTO questions
      (id, topic, difficulty, prompt, a1, a2, a3, a4, correct_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const q of seedQuestions) {
      await tx.executeSql(sql, [
        q.id, q.topic, q.difficulty, q.prompt,
        q.a1, q.a2, q.a3, q.a4, q.correct_index,
      ]);
    }
  });
}

export async function loadQuestions(topic: string, difficulty: string, count: number): Promise<Row[]> {
  const db = await getDB();
  const n = Math.max(1, Math.min(100, Math.floor(Number(count) || 10))); // clamp + default

  const [res] = await db.executeSql(
    `SELECT id, topic, difficulty, prompt, a1, a2, a3, a4, correct_index
     FROM questions
     WHERE topic = ? AND difficulty = ?
     ORDER BY RANDOM()
     LIMIT ${n}`,
    [topic, difficulty]
  );

  const out: Row[] = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i) as Row);
  return out;
}


/** DEV-ONLY: Delete all rows and reseed from ./seed.ts */
export async function resetQuestions() {
  const db = await getDB();
  await db.transaction(async tx => {
    await tx.executeSql(`DELETE FROM questions`);
  });
  await ensureSeed(db);
}

/** DEV-ONLY: Delete the entire DB file, recreate schema, and reseed */
export async function nukeAndRecreate() {
  if (dbRef) {
    try { await dbRef.close(); } catch {}
    dbRef = null;
  }
  await SQLite.deleteDatabase({ name: DB_NAME, location: 'default' });
  // reopen -> rebuild schema -> seed
  await getDB();
}
