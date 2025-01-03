function start() {
    // Function to load totals (income, expense, net balance)
    function loadTotals() {
        fetch('http://localhost:3000/account')  // Get account data
            .then(response => response.json())
            .then(accounts => {
                let totalIncome = 0;
                let totalExpense = 0;
                let netBalance = 0;

                // Calculate total income from account balances
                accounts.forEach(account => {
                    totalIncome += account.balance; // Adjust if income is stored elsewhere
                });

                // Get transaction data to calculate total expenses
                fetch('http://localhost:3000/transaction')
                    .then(response => response.json())
                    .then(transactions => {
                        transactions.forEach(transaction => {
                            if (transaction.type === 'expense') {
                                totalExpense += transaction.amount;
                            }
                        });

                        // Calculate net balance
                        netBalance = totalIncome - totalExpense;

                        // Update UI with fetched totals
                        document.getElementById("total-income").textContent = `Total income\t: $${totalIncome}`;
                        document.getElementById("total-expense").textContent = `Total expense\t: $${totalExpense}`;

                        const netBalanceEle = document.getElementById("net-balance");
                        netBalanceEle.textContent = `Net balance\t: $${netBalance}`;

                        // Set the color for net balance
                        if (netBalance < 0) {
                            netBalanceEle.style.color = "firebrick";
                        } else {
                            netBalanceEle.style.color = "green";
                        }
                    })
                    .catch(error => console.error('Error fetching transaction data:', error));
            })
            .catch(error => console.error('Error fetching account data:', error));
    }

    // Function to update chart with current month's income and expenses
    function updateChart() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let incomeMonth = 0;
        let expenseMonth = 0;

        fetch('http://localhost:3000/transaction')
            .then(response => response.json())
            .then(transactions => {
                transactions.forEach(transaction => {
                    const transactionDate = new Date(transaction.date);
                    const transactionMonth = transactionDate.getMonth();
                    const transactionYear = transactionDate.getFullYear();

                    // Check if transaction is from the current month and year
                    if (transactionMonth === currentMonth && transactionYear === currentYear) {
                        if (transaction.type === "income") {
                            incomeMonth += transaction.amount;
                        } else if (transaction.type === "expense") {
                            expenseMonth += transaction.amount;
                        }
                    }
                });

                // Update the chart with monthly income and expense data
                const ctx = document.getElementById('income-expenses-chart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Income', 'Expense'],
                        datasets: [{
                            label: 'Total for this month',
                            data: [incomeMonth, expenseMonth],
                            backgroundColor: ['#4caf50', '#f44336'],
                            borderColor: ['#388e3c', '#d32f2f'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching transaction data for chart:', error));
    }

    // Function to load transaction history
    function loadTransactionHistory() {
        fetch('http://localhost:3000/transaction')
            .then(response => response.json())
            .then(transactions => {
                const transactionHistory = document.getElementById("transaction-history");
                transactionHistory.innerHTML = ""; // Clear existing history

                // Sort transactions by date and timestamp
                transactions.sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateB - dateA || b.timestamp - a.timestamp;
                });

                // Populate transaction history list
                transactions.forEach(transaction => {
                    const outDate = new Date(transaction.date).toISOString().split('T')[0];
                    transactionHistory.innerHTML += `
                        <li class="${transaction.type}">
                        <div>
                            <strong>${capitalize(transaction.type)}</strong>: $${transaction.amount}<br>
                            Date: ${outDate}<br>
                            ${transaction.details || ""}
                        </div>
                        </li>
                    `;
                });
            })
            .catch(error => console.error('Error fetching transaction history:', error));
    }

    // Helper function to capitalize the first letter of the string
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Call the functions on page load
    loadTotals();
    updateChart();
    loadTransactionHistory();
}

// Start the script when the page is fully loaded
window.addEventListener('load', start, false);
