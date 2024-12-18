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
    loadTotals();
}

window.addEventListener('load', start, false);