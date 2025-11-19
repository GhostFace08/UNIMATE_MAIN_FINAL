const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// list all
router.get('/', async (req, res) => {
  const list = await Student.find().limit(200).sort({ createdAt: -1 });
  res.json(list);
});

// get single
router.get('/:id', async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

// create
router.post('/', async (req, res) => {
  const s = await Student.create(req.body);
  res.json(s);
});

// update
router.put('/:id', async (req, res) => {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(s);
});

// delete
router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
