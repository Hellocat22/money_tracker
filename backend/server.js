const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

let accounts = [];
let transactions = [];

// API Routes
app.get('/account', (req, res) => { //normal
    res.json(accounts);
});

app.get('/account/:id', (req, res) => { //specific by id
    const accountId = parseInt(req.params.id);
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
        res.json(account);
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

app.post('/account', (req, res) => {
    const newAccount = req.body;
    newAccount.id = Date.now(); // Add unique ID
    accounts.push(newAccount);
    res.json({ message: 'Account added successfully', account: newAccount });
});

app.put('/account/:id', (req, res) => {
    const accountId = parseInt(req.params.id);

    console.log(`Updating account with ID: ${accountId}`); //debuigoing
    console.log(`Request Body:`, req.body);

    const updatedAccount = req.body;
    const index = accounts.findIndex(acc => acc.id === accountId);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedAccount };
        res.json({ message: 'Account updated successfully', account: accounts[index] });
    }
    else {
        res.status(404).json({ message: 'Account not found' });
    }
});

app.delete('/account/:id', (req, res) => {
    const accountId = parseInt(req.params.id, 10);
    
    console.log(`Deleting account with ID: ${accountId}`);
    console.log(`Existing accounts:`, accounts);

    const initialLength = accounts.length;
    accounts = accounts.filter(acc => acc.id !== accountId);

    if (accounts.length < initialLength) {
        res.json({ message: 'Account deleted successfully' });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

// TRANSACTION API 
app.get('/transaction', (req, res) => {
    res.json(transactions);
});

app.post('/transaction', (req, res) => {
    const newTransaction = req.body;
    transactions.push(newTransaction);

    // Update account balances
    const account = accounts.find(acc => acc.name === newTransaction.details.split(' || ')[0].split(': ')[1]);
    if (account) {
        if (newTransaction.type === 'income') {
            account.balance += newTransaction.amount;
        } else if (newTransaction.type === 'expense') {
            account.balance -= newTransaction.amount;
        }
    }

    res.status(201).json({ message: 'Transaction created', transaction: newTransaction });
});

app.delete('/transaction/:timestamp', (req, res) => {
    const { timestamp } = req.params;
    const transactionIndex = transactions.findIndex(t => t.timestamp === parseInt(timestamp));

    if (transactionIndex !== -1) {
        const removedTransaction = transactions.splice(transactionIndex, 1)[0];

        // Update account balances
        const account = accounts.find(acc => acc.name === removedTransaction.details.split(' || ')[0].split(': ')[1]);
        if (account) {
            if (removedTransaction.type === 'income') {
                account.balance -= removedTransaction.amount;
            } else if (removedTransaction.type === 'expense') {
                account.balance += removedTransaction.amount;
            }
        }

        res.json({ message: 'Transaction removed' });
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});