const express = require('express');
const cors = require('cors');

const entriesRouter = require('./routes/entries');
const summaryRouter = require('./routes/summary');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/entries', entriesRouter);
app.use('/api/summary', summaryRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Site Diary API listening on http://localhost:${PORT}`);
});
