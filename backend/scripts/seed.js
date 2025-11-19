// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const FinanceTransaction = require('../models/FinanceTransaction');
const FinanceBudget = require('../models/FinanceBudget');
const FinanceGoal = require('../models/FinanceGoal');

const CareerGoal = require('../models/CareerGoal');
const CareerApplication = require('../models/CareerApplication');
const CareerResume = require('../models/CareerResume');

const AcademicCourse = require('../models/AcademicCourse');
const AcademicStudySession = require('../models/AcademicStudySession');

const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const ChatDocument = require('../models/ChatDocument');

// 🔗 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("🌱 Connected to MongoDB. Running seed...");
  seed();
})
.catch(err => {
  console.log("❌ MongoDB connection failed!");
  console.error(err);
  process.exit(1);
});


async function seed() {
  try {

    const userId = "demo-user-123";  // Use same ID for relationships

    // 🌿 FINANCE ------------------------------------------------------
    await FinanceTransaction.deleteMany();
    await FinanceBudget.deleteMany();
    await FinanceGoal.deleteMany();

    await FinanceTransaction.insertMany([
      { user_id: userId, title: "Groceries", amount: 1200, type: "expense", category: "Food", date: new Date(), notes: "Weekly shopping" },
      { user_id: userId, title: "Salary", amount: 25000, type: "income", category: "Job", date: new Date() },
      { user_id: userId, title: "Internet Bill", amount: 800, type: "expense", category: "Utilities", date: new Date() },
    ]);

    await FinanceBudget.insertMany([
      { user_id: userId, category: "Food", amount: 6000, month: new Date() },
      { user_id: userId, category: "Entertainment", amount: 3000, month: new Date() }
    ]);

    await FinanceGoal.insertMany([
      { user_id: userId, title: "Buy New Laptop", target_amount: 80000, current_amount: 15000, deadline: "2025-12-30" },
      { user_id: userId, title: "Build Emergency Fund", target_amount: 50000, current_amount: 8000 }
    ]);

    // 🌿 CAREER ------------------------------------------------------
    await CareerGoal.deleteMany();
    await CareerApplication.deleteMany();
    await CareerResume.deleteMany();

    await CareerGoal.insertMany([
      { user_id: userId, title: "Become Software Engineer", description: "Improve DSA + Projects", status: "in_progress", priority: "high" },
      { user_id: userId, title: "Master React", description: "Finish 3 advanced projects", status: "pending", priority: "medium" }
    ]);

    await CareerApplication.insertMany([
      { user_id: userId, company: "Google", position: "SWE Intern", status: "applied", application_date: new Date() },
      { user_id: userId, company: "Microsoft", position: "SDE Intern", status: "interviewing" }
    ]);

    await CareerResume.insertMany([
      { user_id: userId, file_name: "resume.pdf", file_data: "base64datahere", upload_date: new Date() }
    ]);

    // 🌿 ACADEMICS ------------------------------------------------------
    await AcademicCourse.deleteMany();
    await AcademicStudySession.deleteMany();

    await AcademicCourse.insertMany([
      { user_id: userId, course_name: "Data Structures", course_code: "CS201", credits: 3, grade: "A", semester: "4", status: "completed" },
      { user_id: userId, course_name: "Operating Systems", course_code: "CS305", credits: 4, semester: "5", status: "current" }
    ]);

    await AcademicStudySession.insertMany([
      { user_id: userId, subject: "DSA", duration_minutes: 120, notes: "Practiced graphs", date: new Date() },
      { user_id: userId, subject: "Maths", duration_minutes: 90, notes: "Revised integration" }
    ]);

    // 🌿 CHAT SYSTEM ------------------------------------------------------
    await ChatConversation.deleteMany();
    await ChatMessage.deleteMany();
    await ChatDocument.deleteMany();

    const conv = await ChatConversation.create({
      user_id: userId,
      title: "Finance Chat",
      chat_type: "finance"
    });

    await ChatMessage.insertMany([
      { conversation_id: conv._id, role: "user", content: "How do I save more money?" },
      { conversation_id: conv._id, role: "assistant", content: "Try reducing unnecessary expenses and track expenses." }
    ]);

    await ChatDocument.create({
      conversation_id: conv._id,
      user_id: userId,
      file_name: "bill.png",
      file_data: "base64string",
      chat_type: "finance"
    });

    console.log("🌱 Database seeded successfully!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
