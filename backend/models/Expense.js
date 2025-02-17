const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: String,
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", ExpenseSchema);

