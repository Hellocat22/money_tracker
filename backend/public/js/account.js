function start() {
    const addAccountButton = document.getElementById('add-account');
    const accountCategory = document.getElementById('account-category');
    const accountName = document.getElementById('account-name');
    const accountBalance = document.getElementById('account-balance');

    // Load Accounts
    function loadAccounts() {
        fetch('http://localhost:3000/account')
            .then(response => response.json())
            .then(data => {
                let cashHtml = '';
                let bankHtml = '';
                let creditHtml = '';
                let savingsHtml = '';
    
                data.forEach(account => {
                    const accountHtml = `
                        <li>
                            <div>
                                <strong>${account.name}</strong><br>
                                Balance: $${account.balance}
                            </div>
                            <div class="button-container">
                                <button onclick="editAccount(${account.id})">Edit</button>
                                <button onclick="removeAccount(${account.id})">Remove</button>
                            </div>
                        </li>`;
                    if (account.category === 'Cash') cashHtml += accountHtml;
                    if (account.category === 'Bank Account') bankHtml += accountHtml;
                    if (account.category === 'Credit') creditHtml += accountHtml;
                    if (account.category === 'Savings') savingsHtml += accountHtml;
                });
    
                document.getElementById('cash').innerHTML = cashHtml;
                document.getElementById('bank-account').innerHTML = bankHtml;
                document.getElementById('credit').innerHTML = creditHtml;
                document.getElementById('savings').innerHTML = savingsHtml;
            })
            .catch(err => console.error('Error loading accounts:', err));
    }
    
    // Add Account
    addAccountButton.addEventListener('click', function () {
        const category = accountCategory.value.trim();
        const name = accountName.value.trim();
        const balance = parseInt(accountBalance.value.trim()) || 0;
    
        if (!name) {
            alert('Please enter a valid account name!');
            return;
        }
    
        const account = { category, name, balance };
    
        fetch('http://localhost:3000/account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadAccounts(); // Reload accounts after adding
            })
            .catch(err => console.error('Error adding account:', err));
    
        // Clear input fields
        accountName.value = '';
        accountBalance.value = '';
    });
    
    // Edit Accounts
    window.editAccount = function (id) {
        const newBalance = prompt('Enter the new balance for account ID ' + id);
        const parsedBalance = parseInt(newBalance);
    
        if (!isNaN(parsedBalance) && parsedBalance >= 0) {
            fetch(`http://localhost:3000/account/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ balance: parsedBalance }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    loadAccounts();
                })
                .catch(err => console.error('Error updating account:', err));
        } else {
            alert('Please enter a valid balance.');
        }
    };
    
    // Remove Acc
    window.removeAccount = function (id) {
        fetch(`http://localhost:3000/account/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadAccounts();
            })
            .catch(err => console.error('Error deleting account:', err));
    };
    
}

window.addEventListener('load', start, false);