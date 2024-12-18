function start() {
    const addTransactionButton = document.getElementById('add-transaction');
    const transactionHistory = document.getElementById('transaction-history');
    let totalIncome = 0;
    let totalExpense = 0;

    // Show/Hide fields based on transaction type
    document.getElementById("transaction-type").addEventListener("change", showTransactionFields);
    showTransactionFields(); // Initial call to set up fields on load

    // Load accounts from localStorage
    function loadAccounts() {
        const accounts = JSON.parse(localStorage.getItem('accounts')) || []; // Get accounts if there is any else get NULL
        return accounts;
    }

    function loadAccountList() {
        const accounts = loadAccounts();

        // Helper function to create account options
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

    function showTransactionFields() {
        const type = document.getElementById("transaction-type").value;
        loadAccountList(); // Populate account fields every time transaction type is changed
    
        if (type === "expense") {
            document.getElementById("expense-field").style.display = "block";
            document.getElementById("income-field").style.display = "none";
            document.getElementById("transfer-field").style.display = "none";
        }
        else if (type === "income") {
            document.getElementById("expense-field").style.display = "none";
            document.getElementById("income-field").style.display = "block";
            document.getElementById("transfer-field").style.display = "none";
        }
        else if (type === "transfer") {
            document.getElementById("expense-field").style.display = "none";
            document.getElementById("income-field").style.display = "none";
            document.getElementById("transfer-field").style.display = "block";
        }
    }

    // Add transaction
    addTransactionButton.addEventListener("click", function () {
        const type = document.getElementById("transaction-type").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const dateInput = document.getElementById("transaction-date").value;

        if (isNaN(amount) || amount <= 0 || !amount) {
            alert("Please enter a valid amount!");
            return;
        }

        const date = dateInput ? dateInput : new Date().toISOString().split("T")[0];

        let details = '';
        if (type === "expense") {
            const account = document.getElementById("expense-account").value;
            const tag = document.getElementById("expense-tag").value;
            const notes = document.getElementById("expense-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
            totalExpense += amount;
        }
        else if (type === "income") {
            const account = document.getElementById("income-account").value;
            const tag = document.getElementById("income-tag").value;
            const notes = document.getElementById("income-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
            totalIncome += amount;
        }
        else if (type === "transfer") {
            const fromAccount = document.getElementById("transfer-fromAccount").value;
            const toAccount = document.getElementById("transfer-toAccount").value;
            const notes = document.getElementById("transfer-notes").value;
            details = `From: ${fromAccount} || To: ${toAccount} || Notes: ${notes}`;
        }

        const timestamp = new Date().getTime();
        const transaction = { type, amount, date, details, timestamp };
        localStorage.setItem(timestamp, JSON.stringify(transaction));

        loadTransactionHistory();
        updateTotals();
        resetFields();
    });

    // Load transaction history
    function loadTransactionHistory() {
        transactionHistory.innerHTML = '';
        const transactions = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Check if the key is a valid number (timestamp)
            // localStorage.key(i) returns the key as a string, even if it's a numeric timestamp. 
            // !isNaN(key) ensures that the key can be interpreted as a valid number (timestamp) 
            // before processing it as a transaction. This avoids mistakenly processing 
            // non-numeric keys (such as "user-preference" or "settings") that aren't related 
            // to transactions.
            if (!isNaN(key)) {
                const data = JSON.parse(localStorage.getItem(key));
                transactions.push(data);
            }
        }

        // Sort transactions by timestamp (ascending)
        transactions.sort((a, b) => {
            const A = new Date(a.date).getTime();
            const B = new Date(b.date).getTime();

            if(A !== B){
                return B - A;
            }
            return b.timestamp - a.timestamp;
        });

        totalIncome = 0;
        totalExpense = 0;

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];

            // Ensure the amount is a valid number before doing calculations
            if (isNaN(transaction.amount) || transaction.amount === null) {
                console.error(`Invalid amount for transaction ${transaction.timestamp}:`, transaction.amount);
                continue; // Skip invalid transactions
            }

            if (transaction.type === "income") totalIncome += transaction.amount;
            if (transaction.type === "expense") totalExpense += transaction.amount;

            // Append transaction as a string to the innerHTML
            transactionHistory.innerHTML += `
                <li class="${transaction.type}">
                    <div>
                        <strong>${capitalize(transaction.type)}</strong>: $${transaction.amount}<br>
                        Date: ${transaction.date}<br>
                        ${transaction.details}
                    </div>
                    <button onclick="removeTransaction('${transaction.timestamp}')">Remove</button>
                </li>
            `;
        }

        updateTotals();
    }

    // Update totals
    function updateTotals() {
        const netBalance = totalIncome - totalExpense;
        document.getElementById("total-income").textContent = `Total Income: $${totalIncome}`;
        document.getElementById("total-expense").textContent = `Total Expense: $${totalExpense}`;
        document.getElementById("net-balance").textContent = `Net Balance: $${netBalance}`;

        localStorage.setItem("totalIncome", totalIncome);
        localStorage.setItem("totalExpense", totalExpense);
        localStorage.setItem("netBalance", netBalance);
    }

    // Reset form fields
    function resetFields() {
        const type = document.getElementById("transaction-type").value;
        
        document.getElementById("amount").value = "";
        document.getElementById("transaction-date").value = "";

        if (type === "expense") {
            document.getElementById("expense-field").style.display = "";
            document.getElementById("expense-account").value = "";
            document.getElementById("expense-tag").value = "";
            document.getElementById("expense-notes").value = "";
        }
        else if (type === "income") {
            document.getElementById("income-field").style.display = "";
            document.getElementById("income-account").value = "";
            document.getElementById("income-tag").value = "";
            document.getElementById("income-notes").value = "";
        }
        else if (type === "transfer") {
            document.getElementById("transfer-field").style.display = "";
            document.getElementById("transfer-fromAccount").value = "";
            document.getElementById("transfer-toAccount").value = "";
            document.getElementById("transfer-notes").value = "";
        }
        showTransactionFields();
    }

    // Remove a single transaction
    window.removeTransaction = function (timestamp) {
        // Loop through all items in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // Get the key at the current index
    
            // If the key is equal to the timestamp (indicating it's the transaction we want to remove)
            if (key === timestamp) {
                localStorage.removeItem(key); // Remove the item
                break; // Exit the loop after removing the transaction
            }
        }
        
        // Reload transaction history after removal
        loadTransactionHistory();
    };

    // Capitalize helper
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Initial load
    loadTransactionHistory();
}

window.addEventListener('load', start, false);