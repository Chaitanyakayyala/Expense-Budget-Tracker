const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  detail: String,
  date: String,
  amount: Number,
  type: String,
  id: String, // To match your frontend's id usage
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Budget Schema
const BudgetSchema = new mongoose.Schema({
  budgetType: String,
  amount: Number,
  remaining: Number,
  id: String, // To match your frontend's id usage
});
const Budget = mongoose.model('Budget', BudgetSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// --- Transactions ---
app.get('/api/transactions', async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.status(201).json(transaction);
});

app.delete('/api/transactions/:id', async (req, res) => {
  await Transaction.deleteOne({ id: req.params.id });
  res.sendStatus(204);
});

// --- Budgets ---
app.get('/api/budgets', async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});

app.post('/api/budgets', async (req, res) => {
  const budget = new Budget(req.body);
  await budget.save();
  res.status(201).json(budget);
});

app.delete('/api/budgets/:id', async (req, res) => {
  await Budget.deleteOne({ id: req.params.id });
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
