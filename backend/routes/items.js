
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req,res)=>{
  const items = await Item.find().limit(100);
  res.json(items);
});

router.post('/', async (req,res)=>{
  const it = await Item.create(req.body);
  res.json(it);
});

module.exports = router;
