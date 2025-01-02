function start() {
    const addTransactionButton = document.getElementById('add-transaction');
    const transactionHistory = document.getElementById('transaction-history');
    const accounts = loadAccounts();
    let totalIncome = 0;
    let totalExpense = 0;

    document.getElementById("transaction-type").addEventListener("change", loadTransactionFields);
    loadTransactionFields(); 
    loadTransactionHistory(); 

    function resetFields() {
        // Clear inputs
        document.getElementById("amount").value = "";
        document.getElementById("transaction-date").value = "";
    
        // Hide first
        document.getElementById("expense-account-field").style.display = "none";
        document.getElementById("income-field").style.display = "none";
        document.getElementById("transfer-field").style.display = "none";
    
        // Show and reset fields based on type
        const type = document.getElementById("transaction-type").value;
        if (type === "expense") {
            document.getElementById("expense-account-field").style.display = "table-row";
            document.getElementById("expense-account").value = "";
            document.getElementById("expense-tag").value = "";
            document.getElementById("expense-notes").value = "";
        }
        else if (type === "income") {
            document.getElementById("income-field").style.display = "table-row";
            document.getElementById("income-account").value = "";
            document.getElementById("income-tag").value = "";
            document.getElementById("income-notes").value = "";
        }
        else if (type === "transfer") {
            document.getElementById("transfer-field").style.display = "table-row";
            document.getElementById("transfer-fromAccount").value = "";
            document.getElementById("transfer-toAccount").value = "";
            document.getElementById("transfer-notes").value = "";
        }

        loadTransactionFields();
    }

    function loadTransactionFields() {
        const type = document.getElementById("transaction-type").value;
        loadAccountList(); // Refill account fields every time transaction type is changed
    
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

    function loadAccounts() {
        const accounts = JSON.parse(localStorage.getItem('accounts')) || []; // else = NULL
        return accounts;
    }

    function loadAccountList() {
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

    function loadTransactionHistory() {
        transactionHistory.innerHTML = '';
        const transactions = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            /* Check if the key is a valid number (timestamp) localStorage.key(i) returns the key as a string, 
            even if it's a numeric timestamp. !isNaN(key) ensures that the key can be interpreted as a validnumber (timestamp) 
            before processing it as a transaction. This avoids mistakenly processing non-numeric keys
            (such as "user-preference" or "settings") that aren't related to transactions.*/
            if (!isNaN(key)) {
                const data = JSON.parse(localStorage.getItem(key));
                transactions.push(data);
            }
        }

        // Sorting by timestamp (ascending)
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
            if (isNaN(transaction.amount) || transaction.amount === null) {
                console.error(`Invalid amount for transaction ${transaction.timestamp}:`, transaction.amount);
                continue; // Skip invalid
            }
            if (transaction.type === "income") totalIncome += transaction.amount;
            if (transaction.type === "expense") totalExpense += transaction.amount;
            appendTransactionHistory(transaction);
        }
        updateTotals();
    }

    function appendTransactionHistory(transaction) {
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

    addTransactionButton.addEventListener("click", function () {
        const type = document.getElementById("transaction-type").value;
        const amount = parseInt(document.getElementById("amount").value);
        const dateInput = document.getElementById("transaction-date").value;
        const accounts = loadAccounts();

        if (isNaN(amount) || amount <= 0 || !amount) {
            alert("Please enter a valid amount!");
            return;
        }
        
        let selectedAccount = null;

        if (type === "expense") {
            selectedAccount = document.getElementById("expense-account").value;
        }
        else if (type === "income") {
            selectedAccount = document.getElementById("income-account").value;
        }
        else if (type === "transfer") {
            const fromAccount = document.getElementById("transfer-fromAccount").value;
            const toAccount = document.getElementById("transfer-toAccount").value;
            if (!fromAccount || !toAccount) {
                alert("Please select both 'From' and 'To' accounts for a transfer!");
                return;
            }
            if (fromAccount === toAccount) {
                alert("The 'From' and 'To' accounts cannot be the same!");
                return;
            }
            selectedAccount = fromAccount; // Assign fromAccount to allow validation below
        }

        // Ensure an account is selected
        if (!selectedAccount) {
            alert("Please select a valid account!");
            return;
        }

        const date = dateInput ? dateInput : new Date().toISOString().split("T")[0];

        let details = '';
        if (type === "expense") {
            const account = document.getElementById("expense-account").value;
            const tag = document.getElementById("expense-tag").value;
            const notes = document.getElementById("expense-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
            
            const accounts = loadAccounts();
            const accountObj = accounts.find(acc => acc.name === account);
            if (accountObj) {
                accountObj.balance -= amount; //subtract here
                localStorage.setItem('accounts', JSON.stringify(accounts));
            }

            totalExpense += amount;
        }
        else if (type === "income") {
            const account = document.getElementById("income-account").value;
            const tag = document.getElementById("income-tag").value;
            const notes = document.getElementById("income-notes").value;
            details = `Account: ${account} || Tag: ${tag} || Notes: ${notes}`;
            
            const accounts = loadAccounts();
            const accountObj = accounts.find(acc => acc.name === account);
            if (accountObj) {
                accountObj.balance += amount; //add heeree
                localStorage.setItem('accounts', JSON.stringify(accounts));
            }

            totalIncome += amount;
        }
        else if (type === "transfer") {
            const fromAccount = document.getElementById("transfer-fromAccount").value;
            const toAccount = document.getElementById("transfer-toAccount").value;
            const notes = document.getElementById("transfer-notes").value;
            details = `From: ${fromAccount} || To: ${toAccount} || Notes: ${notes}`;

            const accounts = loadAccounts();
            let fromAccountObj = null;
            let toAccountObj = null;

            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].name === fromAccount) {
                    fromAccountObj = accounts[i];
                }
                if (accounts[i].name === toAccount) {
                    toAccountObj = accounts[i];
                }
            }
            if (fromAccountObj && toAccountObj) {
                fromAccountObj.balance -= amount;
                toAccountObj.balance += amount;
                localStorage.setItem('accounts', JSON.stringify(accounts));
            }
            else {
                alert("Invalid account for the transfer");
                return;
            }

            totalIncome = 0;
            totalExpense = 0;
        }

        const timestamp = new Date().getTime();
        const transaction = { type, amount, date, details, timestamp };
        localStorage.setItem(timestamp, JSON.stringify(transaction));

        loadTransactionHistory();
        updateTotals();
        resetFields();
    });

    function updateTotals() {
        const netBalance = totalIncome - totalExpense;
        document.getElementById("total-income").textContent = `Total Income: $${totalIncome}`;
        document.getElementById("total-expense").textContent = `Total Expense: $${totalExpense}`;
        document.getElementById("net-balance").textContent = `Net Balance: $${netBalance}`;

        const netBalanceElement = document.getElementById("net-balance");
        if (netBalance < 0) {
            netBalanceElement.style.color = 'firebrick';  // Red for negative balance
        }
        else {
            netBalanceElement.style.color = 'green';  // Green for positive balance
        }

        localStorage.setItem("totalIncome", totalIncome);
        localStorage.setItem("totalExpense", totalExpense);
        localStorage.setItem("netBalance", netBalance);
    }

    // Remove a single transaction
    window.removeTransaction = function (timestamp) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === timestamp) {
                localStorage.removeItem(key); 
                break; 
            }
        }
        loadTransactionHistory();
    };
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

window.addEventListener('load', start, false);