
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// register
router.post('/register', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!email||!password) return res.status(400).json({error:'missing fields'});
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ error: 'user exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ id: user._id, name: user.name, email: user.email });
  }catch(e){ res.status(500).json({ error: e.message }) }
});

// login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'invalid' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: 'invalid' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token });
  }catch(e){ res.status(500).json({ error: e.message }) }
});

module.exports = router;
