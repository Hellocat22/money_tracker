// Handle transaction type change
document.getElementById("transaction-type").addEventListener("change", function() {
    const type = this.value;
    const expenseFields = document.getElementById("expense-field");

    // Show expense-specific fields if the transaction type is expense
    if (type === "expense") {
        expenseFields.style.display = "block";
    } else {
        expenseFields.style.display = "none";
    }
});

// Handle adding a transaction
document.getElementById("add-transaction").addEventListener("click", function() {
    const type = document.getElementById("transaction-type").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    let transactionDetails = `${type.charAt(0).toUpperCase() + type.slice(1)}: $${amount.toFixed(2)}`;

    // If it's an expense, get additional details
    if (type === "expense") {
        const account = document.getElementById("account").value;
        const category = document.getElementById("category").value;
        const notes = document.getElementById("notes").value;
        transactionDetails += ` | Account: ${account} | Category: ${category} | Notes: ${notes}`;
    }

    // Add the transaction to the history
    const list = document.getElementById("transaction-list");
    const li = document.createElement("li");
    li.textContent = transactionDetails;
    li.classList.add(type);
    list.appendChild(li);

    // Clear input fields
    document.getElementById("amount").value = "";
    document.getElementById("transaction-type").value = "expense";
    document.getElementById("category").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("account").value = "";
});