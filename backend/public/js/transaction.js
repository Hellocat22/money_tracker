let totalIncome = 0;
let totalExpense = 0;
const transactionHistory = document.getElementById('transaction-history');  // Make this accessible globally

async function removeTransaction(timestamp) {
    try {
        const response = await fetch(`https://money-tracker-xq47.onrender.com/transaction/${timestamp}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data.message);
        loadTransactionHistory(); // Reload transactions after removing
    } catch (error) {
        console.error('Error removing transaction:', error);
    }
}

function updateTotals() {
    const netBalance = totalIncome - totalExpense;
    document.getElementById("total-income").textContent = `Total Income: $${totalIncome}`;
    document.getElementById("total-expense").textContent = `Total Expense: $${totalExpense}`;
    document.getElementById("net-balance").textContent = `Net Balance: $${netBalance}`;

    const netBalanceElement = document.getElementById("net-balance");
    if (netBalance < 0) {
        netBalanceElement.style.color = 'firebrick';  // Red for negative balance
    } else {
        netBalanceElement.style.color = 'green';  // Green for positive balance
    }
}

async function loadTransactionHistory() {
    try {
        const response = await fetch('https://money-tracker-xq47.onrender.com/transaction');
        const transactions = await response.json();

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        totalIncome = 0;
        totalExpense = 0;

        transactionHistory.innerHTML = ''; // Clear existing transactions
        transactions.forEach(transaction => {
            if (transaction.type === 'income') totalIncome += transaction.amount;
            if (transaction.type === 'expense') totalExpense += transaction.amount;
            appendTransactionHistory(transaction);
        });
        updateTotals();
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

function appendTransactionHistory(transaction) {
    const outDate = new Date(transaction.date).toISOString().split('T')[0];
    transactionHistory.innerHTML += `
            <li class="${transaction.type}">
                <div>
                    <strong>${capitalize(transaction.type)}</strong>: $${transaction.amount}<br>
                    Date: ${outDate}<br>
                    ${transaction.details}
                </div>
                <button onclick="removeTransaction('${transaction.timestamp}')">Remove</button>
            </li>
        `;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function addTransaction(type, amount, dateInput, details) {
    try {
        const newTransaction = {
            type,
            amount,
            date: dateInput || new Date().toISOString().split('T')[0],
            details,
            timestamp: new Date().getTime(),
        };

        // Handle the transfer scenario
        if (type === 'transfer') {
            const fromAccount = document.getElementById("transfer-fromAccount").value;
            const toAccount = document.getElementById("transfer-toAccount").value;

            // Create the transfer object for the source and destination accounts
            const transferData = {
                fromAccount,
                toAccount,
                amount,
                date: newTransaction.date,
                timestamp: newTransaction.timestamp,
            };

            // Send the transfer data to the server (you may need to adjust your backend to handle the transfer logic)
            const response = await fetch('https://money-tracker-xq47.onrender.com/transaction/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transferData),
            });

            const data = await response.json();
            console.log(data.message);
        } else {
            // For income or expense, proceed with the normal transaction flow
            const response = await fetch('https://money-tracker-xq47.onrender.com/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });

            const data = await response.json();
            console.log(data.message);
        }

        // Reload transactions and account data after adding the transaction
        loadTransactionHistory(); // Reload transactions after adding
        loadAccountList(); // Reload account balances after the transfer
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
}


function start() {
    const addTransactionButton = document.getElementById('add-transaction');
    document.getElementById("transaction-type").addEventListener("change", loadTransactionFields);
    loadTransactionFields(); 
    loadTransactionHistory(); 

    async function loadTransactionFields() {
        const type = document.getElementById("transaction-type").value;
        await loadAccountList();  // Make sure this is awaited

        if (type === "expense") {
            document.getElementById("expense-account-field").style.display = "table-row";
            document.getElementById("income-field").style.display = "none";
            document.getElementById("transfer-field").style.display = "none";
        }
        else if (type === "income") {
            document.getElementById("expense-account-field").style.display = "none";
            document.getElementById("income-field").style.display = "table-row";
            document.getElementById("transfer-field").style.display = "none";
        }
        else if (type === "transfer") {
            document.getElementById("expense-account-field").style.display = "none";
            document.getElementById("income-field").style.display = "none";
            document.getElementById("transfer-field").style.display = "table-row";
        }
    }

    async function loadAccounts() {
        try {
            const response = await fetch('https://money-tracker-xq47.onrender.com/account');
            const text = await response.text();  // Read the raw response as text
            console.log('Raw Response:', text);  // Log the raw response
            const accounts = JSON.parse(text);  // Now parse the JSON manually
            return accounts;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];  // Return empty array if fetching fails
        }
    }

    async function loadAccountList() {
        const accounts = await loadAccounts();  // Fetch accounts from backend

        const createAccountOptions = (accounts) => {
            let optionsHtml = '';
            for (let i = 0; i < accounts.length; i++) {
                optionsHtml += `<option value="${accounts[i].name}">${accounts[i].name}</option>`;
            }
            return optionsHtml;
        };

        // Set account options in the fields
        document.getElementById('expense-account').innerHTML = createAccountOptions(accounts);
        document.getElementById('income-account').innerHTML = createAccountOptions(accounts);
        document.getElementById('transfer-fromAccount').innerHTML = createAccountOptions(accounts);
        document.getElementById('transfer-toAccount').innerHTML = createAccountOptions(accounts);
    }

    addTransactionButton.addEventListener("click", async function () {
        const type = document.getElementById("transaction-type").value;
        const amount = parseInt(document.getElementById("amount").value);
        const dateInput = document.getElementById("transaction-date").value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount!");
            return;
        }

        let details = '';
        let accountSelected = false;

        if (type === "expense") {
            const account = document.getElementById("expense-account").value;
            if (!account) {
                alert("Please select an account for the expense!");
                return;
            }
            const tag = document.getElementById("expense-tag").value;
            const notes = document.getElementById("expense-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
        } else if (type === "income") {
            const account = document.getElementById("income-account").value;
            if (!account) {
                alert("Please select an account for the income!");
                return;
            }
            const tag = document.getElementById("income-tag").value;
            const notes = document.getElementById("income-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
        }

        await addTransaction(type, amount, dateInput, details);
    });
}

window.addEventListener('load', start, false);
