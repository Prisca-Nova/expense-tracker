const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Add an expense
router.post("/", async (req, res) => {
  try {
    const { user, category, amount } = req.body;
    const expense = new Expense({ user, category, amount });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

module.exports = router;

