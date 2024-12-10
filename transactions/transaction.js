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

// Tab switching logic
document.querySelectorAll(".topbar ul li").forEach(tab => {
    tab.addEventListener("click", function() {
        // Remove 'active' class from all tabs
        document.querySelectorAll(".topbar ul li").forEach(t => t.classList.remove("active"));
        
        // Add 'active' class to the clicked tab
        this.classList.add("active");

        // Hide all iframes
        document.querySelectorAll("iframe").forEach(iframe => iframe.style.display = "none");

        // Update the section title and show the relevant iframe
        const sectionTitle = document.getElementById("section-title");
        if (this.id === "dashboard-tab") {
            sectionTitle.textContent = "Dashboard";
            document.getElementById("dashboard-iframe").style.display = "block";
        } else if (this.id === "transaction-tab") {
            sectionTitle.textContent = "Transactions";
            document.getElementById("transaction-iframe").style.display = "block";
        } else if (this.id === "account-tab") {
            sectionTitle.textContent = "Accounts";
            document.getElementById("account-iframe").style.display = "block";
        }
    });
});
