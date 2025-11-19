const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// list logs
router.get('/', async (req, res) => {
  const list = await Log.find().limit(500).sort({ createdAt: -1 });
  res.json(list);
});

// get single log
router.get('/:id', async (req, res) => {
  const l = await Log.findById(req.params.id);
  if (!l) return res.status(404).json({ error: 'Log not found' });
  res.json(l);
});

// create log
router.post('/', async (req, res) => {
  const l = await Log.create(req.body);
  res.json(l);
});

// delete
router.delete('/:id', async (req, res) => {
  await Log.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
