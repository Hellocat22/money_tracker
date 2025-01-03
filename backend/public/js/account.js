function start() {
    const addAccountButton = document.getElementById('add-account');
    const accountCategory = document.getElementById('account-category');
    const accountName = document.getElementById('account-name');
    const accountBalance = document.getElementById('account-balance');

    // Load Accounts
    function loadAccounts() {
        fetch('http://localhost:3000/account')
            .then(response => response.json())
            .then(accounts => {
                let cashHtml = '';
                let bankHtml = '';
                let creditHtml = '';
                let savingsHtml = '';

                accounts.forEach(account => {
                    const accountHtml = `
                        <li>
                            <div>
                                <strong>${account.name}</strong><br>
                                Balance: $${account.balance}
                            </div>
                            <div class="button-container">
                                <button onclick="editAccount(${account.id}, event)">Edit</button>
                                <button onclick="removeAccount(${account.id}, event)">Remove</button>
                            </div>
                        </li>
                    `;

                    if (account.category === 'Cash') {
                        cashHtml += accountHtml;
                    }
                    else if (account.category === 'Bank Account') {
                        bankHtml += accountHtml;
                    }
                    else if (account.category === 'Credit') {
                        creditHtml += accountHtml;
                    }
                    else if (account.category === 'Savings') {
                        savingsHtml += accountHtml;
                    }
                });

                document.getElementById('cash').innerHTML = cashHtml;
                document.getElementById('bank-account').innerHTML = bankHtml;
                document.getElementById('credit').innerHTML = creditHtml;
                document.getElementById('savings').innerHTML = savingsHtml;
            })
        .catch(error => console.error('Error fetching accounts:', error));
    }

    // Add Account
    addAccountButton.addEventListener('click', function () {
        const category = accountCategory.value.trim(); // Remove unnecessary whitespaces
        const name = accountName.value.trim();
        const balance = parseInt(accountBalance.value.trim()) || 0;

        if (!name) {
            alert('Please enter a valid account name!');
            return;
        }

        const account = { category, name, balance };

        fetch('http://localhost:3000/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);  // Log success message
                loadAccounts();  // Reload accounts
            })
            .catch(error => console.error('Error adding account:', error));
    });

    // Edit Accounts
    window.editAccount = function (id, event) {
        if (event) {
            event.preventDefault();
        }
        //console.log('Fetching account with ID:', id); //debug

        fetch(`http://localhost:3000/account/${id}`)
            .then(response => response.json())
            .then(account => {
                const newBalance = prompt(`Enter the new balance for ${account.name}`, account.balance);
                const parsedBalance = parseInt(newBalance);
    
                if (!isNaN(parsedBalance) && parsedBalance >= 0) {
                    const updatedAccount = { ...account, balance: parsedBalance };
                    fetch(`http://localhost:3000/account/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedAccount),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.message);  // success consol
                            loadAccounts();  
                        })
                        .catch(error => console.error('Error updating account:', error));
                } else {
                    alert('Please enter a valid balance.');
                }
            })
            .catch(error => console.error('Error fetching account:', error));
    };
    

    // Remove Acc
    window.removeAccount = function (id, event) {
        if (event) {
            event.preventDefault();
        }
        fetch(`http://localhost:3000/account/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);  // Log success message
                loadAccounts();  // Reload accounts
            })
            .catch(error => console.error('Error deleting account:', error));
    };
    loadAccounts();
}

window.addEventListener('load', start, false);