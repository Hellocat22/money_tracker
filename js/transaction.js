/*// Tab switching logic
const tabs = document.querySelectorAll(".navbar li");
for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function() {
        // Update current tab
        setActiveTab(this);

        // Update title of the current active tab and display the current iframe
        updateSection(this.id);
    });
}

// Helper function to set the active tab
function setActiveTab(selectedTab) {
    document.querySelectorAll(".navbar li");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    selectedTab.classList.add("active");
}

// Helper function to update the section title or navigate to other pages
function updateSection(tabId) {
    const sectionTitle = document.getElementById("section-title");
    const pageMapping = {
        "dashboard-tab": {title: "Dashboard", page: "index.html"},
        "transaction-tab": {title: "Transactions", page: "transaction.html"},
        "account-tab": {title: "Accounts", page: "account.html"}
    }
    
    const current = pageMapping[tabId];
    if (current) {
        if (current.page) {
            window.location.href = current.page;
        }
        else {
            sectionTitle.textContent = current.title;
        }
    }
}*/

function initialize() {
    const transactionType = document.getElementById("transaction-type").value;
    const expenseField = document.getElementById("expense-field");

    if (transactionType === "expense") {
        expenseField.style.display = "block";
    }
    else {
        expenseField.style.display = "none";
    }
}

// Show or hide expense-specific fields based on transaction type
document.getElementById("transaction-type").addEventListener("change", function () {
    const expenseField = document.getElementById("expense-field");
    const incomeField = document.getElementById("income-field");
    const transferField = document.getElementById("transfer-field");
    
    expenseField.style.display = "none";
    incomeField.style.display = "none";
    transferField.style.display = "none";

    if (this.value === "expense") {
        expenseField.style.display = "block";
    }
    else if (this.value === "income") {
        incomeField.style.display = "block";
    }
    else if (this.value === "transfer") {
        transferField.style.display = "block";
    }
});

let totalIncome = 0;
let totalExpense = 0;

function updateTotal() {
    document.getElementById("total-income").textContent = `Total Income so far: $${totalIncome.toFixed(2)}`;
    document.getElementById("total-expense").textContent = `Total Expense so far: $${totalExpense.toFixed(2)}`;
    let netBalance = totalIncome - totalExpense;
    document.getElementById("net-balance").textContent = `Net Balance: $${netBalance.toFixed(2)}`;
}

// Add a new transaction
document.getElementById("add-transaction").addEventListener("click", function () {
    const type = document.getElementById("transaction-type").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }
    
    let transactionDetails = `${capitalize(type)}: $${amount.toFixed(2)}`;

    // Add expense details if the transaction is an expense
    if (type === "expense") {
        const account = document.getElementById("expense-account").value;
        const category = document.getElementById("expense-category").value;
        const notes = document.getElementById("expense-notes").value;
        transactionDetails += `<br>Account: ${account} | Category: ${category} | Notes: ${notes}`;
        totalExpense += amount;
    }
    else if (type === "income") {
        const account = document.getElementById("income-account").value;
        const category = document.getElementById("income-category").value;
        const notes = document.getElementById("income-notes").value;
        transactionDetails += `<br>Account: ${account} | Category: ${category} | Notes: ${notes}`;
        totalIncome += amount;
    }
    else if (type === "transfer") {
        const fromAccount = document.getElementById("transfer-fromAccount").value;
        const toAccount = document.getElementById("transfer-toAccount").value;
        const notes = document.getElementById("transfer-notes").value;
        transactionDetails += `<br>From: ${fromAccount} | To: ${toAccount} | Notes: ${notes}`;
    }

    // Add the transaction to the transaction list
    const transactionList = document.getElementById("transaction-list");
    const newTransaction = document.createElement("li");
    newTransaction.innerHTML = transactionDetails;
    newTransaction.classList.add(type);
    transactionList.appendChild(newTransaction);

    updateTotal()

    // Reset input fields
    resetFields();
});

// Helper function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to reset input fields to their default state
function resetFields() {
    const type = document.getElementById("transaction-type").value;

    document.getElementById("amount").value = "";
    if (type === "expense"){
        document.getElementById("expense-field").style.display = "";
        document.getElementById("expense-account").value = "";
        document.getElementById("expense-category").value = "";
        document.getElementById("expense-notes").value = "";
    }
    else if (type === "income") {
        document.getElementById("income-field").style.display = "";
        document.getElementById("income-account").value = "";
        document.getElementById("income-category").value = "";
        document.getElementById("income-notes").value = "";
    }
    else if (type === "transfer") {
        document.getElementById("transfer-field").style.display = "";
        document.getElementById("transfer-fromAccount").value = "";
        document.getElementById("transfer-toAccount").value = "";
        document.getElementById("transfer-notes").value = "";
    }
}

initialize();
updateTotal();