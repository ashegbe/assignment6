
// Model: all SQL lives here.
const pool = require('../db/pool');

// Returns an array of topic names.
async function getTopics() {
  const { rows } = await pool.query('SELECT name FROM topics ORDER BY name');
  return rows.map((r) => r.name);
}

async function topicExists(topic) {
  const { rows } = await pool.query('SELECT 1 FROM topics WHERE name = $1', [topic]);
  return rows.length > 0;
}

// Questions for a topic, with optional difficulty filter and limit.
async function getQuestionsByTopic(topic, { difficulty, limit } = {}) {
  const params = [topic];
  let sql = `
    SELECT q.id, t.name AS topic, q.question, q.answer, q.difficulty
    FROM questions q JOIN topics t ON t.id = q.topic_id
    WHERE t.name = $1`;
  if (difficulty) {
    params.push(difficulty);
    sql += ` AND q.difficulty = $${params.length}`;
  }
  sql += ' ORDER BY q.id';
  if (limit) {
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
  }
  const { rows } = await pool.query(sql, params);
  return rows;
}

// One random question, WITHOUT the answer.
async function getRandomQuestion() {
  const { rows } = await pool.query(`
    SELECT q.id, t.name AS topic, q.question, q.difficulty
    FROM questions q JOIN topics t ON t.id = q.topic_id
    ORDER BY RANDOM() LIMIT 1`);
  return rows[0] || null;
}

async function getQuestionById(id) {
  const { rows } = await pool.query('SELECT id, answer FROM questions WHERE id = $1', [id]);
  return rows[0] || null;
}

// Inserts a question, creating the topic first if needed.
async function addQuestion({ topic, question, answer, difficulty }) {
  const t = await pool.query(
    `INSERT INTO topics (name) VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [topic]
  );
  await pool.query(
    'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
    [t.rows[0].id, question, answer, difficulty]
  );
}

module.exports = {
  getTopics,
  topicExists,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion,
};