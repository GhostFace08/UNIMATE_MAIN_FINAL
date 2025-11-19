
const express = require('express');
const router = express.Router();
const Model = require('../models/CareerResume');

router.post('/', async (req,res)=> {
  const item = await Model.create(req.body);
  res.json(item);
});

router.get('/', async (req,res)=> {
  res.json(await Model.find());
});

router.get('/:id', async (req,res)=> {
  res.json(await Model.findById(req.params.id));
});

router.put('/:id', async (req,res)=> {
  res.json(await Model.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete('/:id', async (req,res)=> {
  await Model.findByIdAndDelete(req.params.id);
  res.json({success:true});
});

module.exports = router;
