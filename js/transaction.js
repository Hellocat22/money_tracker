// Tab switching logic
const tabs = document.querySelectorAll(".topbar ul li");
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
    document.querySelectorAll(".topbar ul li");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    selectedTab.classList.add("active");
}

// Helper function to update the section title or navigate to other pages
function updateSection(tabId) {
    const sectionTitle = document.getElementById("section-title");
    const pageMapping = {
        "dashboard-tab": {title: "Dashboard", page: null},
        "transaction-tab": {title: "Transactions", page: "transaction.html"},
        "account-tab": {title: "Accounts", page: "account.html"}
    }
    
    const current = pageMapping[tabId];
    if (current) {
        if (current.page) {
            window.location.href = current.page;
        } else {
            sectionTitle.textContent = current.title;
        }
    }
}

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
    const isExpense = document.getElementById("expense-field");

    if (this.value === "expense") {
        expenseField.style.display = "block";
    }
    else {
        expenseField.style.display = "none";
    }
});

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
        const account = document.getElementById("account").value;
        const category = document.getElementById("category").value;
        const notes = document.getElementById("notes").value;
        transactionDetails += ` | Account: ${account} | Category: ${category} | Notes: ${notes}`;
    }

    // Add the transaction to the transaction list
    const transactionList = document.getElementById("transaction-list");
    const newTransaction = document.createElement("li");
    newTransaction.textContent = transactionDetails;
    newTransaction.classList.add(type);
    transactionList.appendChild(newTransaction);

    // Reset input fields
    resetFields();
});

// Helper function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to reset input fields to their default state
function resetFields() {
    document.getElementById("amount").value = "";
    document.getElementById("transaction-type").value = "expense";
    document.getElementById("expense-field").style.display = "block";
    document.getElementById("account").value = "";
    document.getElementById("category").value = "";
    document.getElementById("notes").value = "";
}

initialize();