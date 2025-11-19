
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.error(err));

app.get('/',(req,res)=>res.json({msg:"Backend OK"}));

app.use('/api/finance/transactions', require('./routes/finance_transactions'));
app.use('/api/finance/budgets', require('./routes/finance_budgets'));
app.use('/api/finance/goals', require('./routes/finance_goals'));

app.use('/api/career/goals', require('./routes/career_goals'));
app.use('/api/career/applications', require('./routes/career_applications'));
app.use('/api/career/resumes', require('./routes/career_resumes'));

app.use('/api/academic/courses', require('./routes/academic_courses'));
app.use('/api/academic/study', require('./routes/academic_study_sessions'));

app.use('/api/chat/conversations', require('./routes/chat_conversations'));
app.use('/api/chat/messages', require('./routes/chat_messages'));
app.use('/api/chat/documents', require('./routes/chat_documents'));

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log("Backend running on "+port));
