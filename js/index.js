function start() {
    function loadTotals(){
        const totalIncome = localStorage.getItem("totalIncome") || 0;
        const totalExpense = localStorage.getItem("totalExpense") || 0;
        const netBalance = localStorage.getItem("netBalance") || 0;

        document.getElementById("total-income").textContent = `Total income\t: $${totalIncome}`;
        document.getElementById("total-expense").textContent = `Total expense\t: $${totalExpense}`;
        
        const netBalanceEle = document.getElementById("net-balance");
        netBalanceEle.textContent = `Net balance\t: $${netBalance}`;

        if (netBalance < 0){
            netBalanceEle.style.color = "firebrick";
        } else {
            netBalanceEle.style.color = "green";
        }
    }
    function updateChart(){
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let incomeMonth = 0;
        let expenseMonth = 0;

        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);
            if(!isNaN(key)){
                const transaction = JSON.parse(localStorage.getItem(key));
                const transactionDate = new Date(transaction.date);
                const transactionMonth = transactionDate.getMonth();
                const transactionYear = transactionDate.getFullYear();

                if(transactionMonth === currentMonth && transactionYear === currentYear){
                    if(transaction.type === "income")
                        incomeMonth += transaction.amount;
                    else if(transaction.type === "expense")
                        expenseMonth += transaction.amount;
                }
            }
        }
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
    }
    function loadTransactionHistory() {
        const transactionHistory = document.getElementById("transaction-history");
        transactionHistory.innerHTML = ""; // Clear the existing list
        const transactions = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!isNaN(key)) {
                const transaction = JSON.parse(localStorage.getItem(key));
                transactions.push(transaction);
            }
        }

        // Sort transactions by date and timestamp
        transactions.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA || b.timestamp - a.timestamp;
        });

        // Populate transaction history
        transactions.forEach((transaction) => {
            transactionHistory.innerHTML += `
                <li class="${transaction.type}">
                    <strong>${capitalize(transaction.type)}</strong>: $${transaction.amount}<br>
                    Date: ${transaction.date}<br>
                    ${transaction.details || ""}
                </li>
            `;
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    loadTotals();
    updateChart();
    loadTransactionHistory();
}

window.addEventListener('load', start, false);