const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/summary - entries grouped by contract with a count per contract
router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT contract, COUNT(*) as count, MAX(date) as lastEntryDate
       FROM entries
       GROUP BY contract
       ORDER BY count DESC, contract ASC`
    )
    .all();

  res.json(rows);
});

module.exports = router;
