// Controller: validates input, calls the model, shapes the response.
const model = require('../models/triviaModel');

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const isBlank = (v) => typeof v !== 'string' || v.trim() === '';

// GET /triviabook/topics
async function getTopics(req, res, next) {
  try {
    res.json(await model.getTopics());
  } catch (err) {
    next(err);
  }
}

// GET /triviabook/topic/:topic?limit=&difficulty=
async function getQuestionsByTopic(req, res, next) {
  try {
    const topic = req.params.topic.trim().toLowerCase();
    const { limit, difficulty } = req.query;

    if (!(await model.topicExists(topic))) {
      return res.status(404).json({ error: `Topic '${topic}' not found.` });
    }

    let parsedLimit;
    if (limit !== undefined) {
      parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        return res.status(400).json({ error: 'limit must be a positive integer.' });
      }
    }

    let parsedDifficulty;
    if (difficulty !== undefined) {
      parsedDifficulty = String(difficulty).toLowerCase();
      if (!DIFFICULTIES.includes(parsedDifficulty)) {
        return res.status(400).json({ error: 'difficulty must be easy, medium, or hard.' });
      }
    }

    const questions = await model.getQuestionsByTopic(topic, {
      limit: parsedLimit,
      difficulty: parsedDifficulty,
    });
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

// GET /triviabook/random
async function getRandomQuestion(req, res, next) {
  try {
    const question = await model.getRandomQuestion();
    if (!question) return res.status(404).json({ error: 'No questions in the database.' });
    res.json(question);
  } catch (err) {
    next(err);
  }
}

// POST /triviabook/answer  { id, guess }
async function checkAnswer(req, res, next) {
  try {
    const { id, guess } = req.body || {};
    if (id === undefined || guess === undefined) {
      return res.status(400).json({ error: 'Both id and guess are required.' });
    }
    const questionId = Number(id);
    if (!Number.isInteger(questionId)) {
      return res.status(400).json({ error: 'id must be an integer.' });
    }

    const found = await model.getQuestionById(questionId);
    if (!found) return res.status(404).json({ error: `Question ${questionId} not found.` });

    const correct = String(guess).trim().toLowerCase() === found.answer.trim().toLowerCase();
    res.json({ correct, answer: found.answer });
  } catch (err) {
    next(err);
  }
}

// POST /triviabook/question/add  { topic, question, answer, difficulty }
async function addQuestion(req, res, next) {
  try {
    const { topic, question, answer, difficulty } = req.body || {};
    if (isBlank(topic) || isBlank(question) || isBlank(answer) || isBlank(difficulty)) {
      return res
        .status(400)
        .json({ error: 'topic, question, answer, and difficulty are all required.' });
    }
    const level = difficulty.trim().toLowerCase();
    if (!DIFFICULTIES.includes(level)) {
      return res.status(400).json({ error: 'difficulty must be easy, medium, or hard.' });
    }

    const cleanTopic = topic.trim().toLowerCase();
    await model.addQuestion({
      topic: cleanTopic,
      question: question.trim(),
      answer: answer.trim(),
      difficulty: level,
    });
    res.status(201).json(await model.getQuestionsByTopic(cleanTopic));
  } catch (err) {
    next(err);
  }
}

module.exports = { getTopics, getQuestionsByTopic, getRandomQuestion, checkAnswer, addQuestion };
