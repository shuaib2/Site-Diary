const express = require('express');
const db = require('../db');
const { validateEntry } = require('../validation');

const router = express.Router();

// GET /api/entries?contract=Foo - list entries, newest first, optional contract filter
router.get('/', (req, res) => {
  const { contract } = req.query;

  let rows;
  if (contract && contract.trim()) {
    rows = db
      .prepare(
        `SELECT * FROM entries WHERE contract = ? ORDER BY date DESC, id DESC`
      )
      .all(contract.trim());
  } else {
    rows = db.prepare(`SELECT * FROM entries ORDER BY date DESC, id DESC`).all();
  }

  res.json(rows);
});

// GET /api/entries/contracts - distinct contract names, for the filter dropdown
router.get('/contracts', (req, res) => {
  const rows = db
    .prepare(`SELECT DISTINCT contract FROM entries ORDER BY contract ASC`)
    .all();
  res.json(rows.map((r) => r.contract));
});

// POST /api/entries - create a new entry
router.post('/', (req, res) => {
  const errors = validateEntry(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { date, contract, weather, notes, author } = req.body;

  const result = db
    .prepare(
      `INSERT INTO entries (date, contract, weather, notes, author) VALUES (?, ?, ?, ?, ?)`
    )
    .run(date, contract.trim(), (weather || '').trim(), notes.trim(), author.trim());

  const created = db.prepare(`SELECT * FROM entries WHERE id = ?`).get(result.lastInsertRowid);
  res.status(201).json(created);
});

module.exports = router;
