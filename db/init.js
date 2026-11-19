const pool = require('./pool');

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS topics (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS questions (
      id         SERIAL PRIMARY KEY,
      topic_id   INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      question   TEXT NOT NULL,
      answer     TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
    );
  `);
}

module.exports = initDb;