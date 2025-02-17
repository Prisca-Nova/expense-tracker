require("dotenv").config();
const express = require("express");
const cors = require("cors");
//app.use(cors({origin:"*"}));
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenses");


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({origin: "*"}));
app.use(express.json());

// Routes
app.use("/api/expenses", require("./routes/expenses"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
    res.send("Welcome to the Expense Tracker API! Use /api/expenses to access data.");
});

