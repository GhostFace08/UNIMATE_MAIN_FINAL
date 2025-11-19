const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// list all devices
router.get('/', async (req, res) => {
  const list = await Device.find().limit(200).sort({ createdAt: -1 });
  res.json(list);
});

// get single device
router.get('/:id', async (req, res) => {
  const d = await Device.findById(req.params.id);
  if (!d) return res.status(404).json({ error: 'Device not found' });
  res.json(d);
});

// create
router.post('/', async (req, res) => {
  const d = await Device.create(req.body);
  res.json(d);
});

// update
router.put('/:id', async (req, res) => {
  const d = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(d);
});

// delete
router.delete('/:id', async (req, res) => {
  await Device.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
