// Run once with: npm run seed
// Creates tables and (re)loads the seed data. WARNING: clears existing rows first.
const pool = require('./pool');
const initDb = require('./init');

const topics = ['science', 'geography'];

const scienceQuestions = [
  { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
  { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' },
];

const geographyQuestions = [
  { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
  { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' },
];

const seedData = { science: scienceQuestions, geography: geographyQuestions };

async function seed() {
  await initDb();
  // Start fresh so re-running the seed never creates duplicates.
  await pool.query('TRUNCATE questions, topics RESTART IDENTITY CASCADE');
  for (const topic of topics) {
    const t = await pool.query('INSERT INTO topics (name) VALUES ($1) RETURNING id', [topic]);
    for (const q of seedData[topic]) {
      await pool.query(
        'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
        [t.rows[0].id, q.question, q.answer, q.difficulty]
      );
    }
  }
  console.log('Seed complete.');
}

seed()
  .catch((err) => console.error('Seed failed:', err))
  .finally(() => pool.end());
