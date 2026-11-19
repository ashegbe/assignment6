
require('dotenv').config();
const express = require('express');
const initDb = require('./db/init');
const triviaRouter = require('./routes/triviaRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/triviabook', triviaRouter);


app.get('/', (req, res) => res.json({ message: 'Triviabook API. Try /triviabook/topics' }));


app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));


app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
