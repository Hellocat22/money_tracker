const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace this with a real database in production)
let accounts = [];
let transactions = [];

// API Routes
app.get('/accounts', (req, res) => {
    res.json(accounts);
});

app.post('/accounts', (req, res) => {
    const newAccount = req.body;
    newAccount.id = Date.now(); // Add unique ID
    accounts.push(newAccount);
    res.json({ message: 'Account added successfully', account: newAccount });
});

app.put('/accounts/:id', (req, res) => {
    const accountId = parseInt(req.params.id);
    const updatedAccount = req.body;

    const index = accounts.findIndex(acc => acc.id === accountId);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedAccount };
        res.json({ message: 'Account updated successfully', account: accounts[index] });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

app.delete('/accounts/:id', (req, res) => {
    const accountId = parseInt(req.params.id);
    accounts = accounts.filter(acc => acc.id !== accountId);
    res.json({ message: 'Account deleted successfully' });
});

app.get('/transactions', (req, res) => {
    res.json(transactions);
});

app.post('/transactions', (req, res) => {
    const newTransaction = req.body;
    newTransaction.id = Date.now(); // Add unique ID
    transactions.push(newTransaction);
    res.json({ message: 'Transaction added successfully', transaction: newTransaction });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});