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
                                <button onclick="editAccount(${account.id})">Edit</button>
                                <button onclick="removeAccount(${account.id})">Remove</button>
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
    window.editAccount = function (id) {
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            
            // Check if the current account = matching ID ?
            if (account.id === id) {
                const newBalance = prompt("Enter the new balance for " + account.name, account.balance);
                const parsedBalance = parseInt(newBalance);

                if (!isNaN(parsedBalance) && parsedBalance >= 0) {
                    account.balance = parsedBalance;
                    localStorage.setItem('accounts', JSON.stringify(accounts));
    
                    loadAccounts();
                }
                else {
                    alert("Please enter a valid balance.");
                }
                break;
            }
        }
    };

    // Remove Acc
    window.removeAccount = function (id) {
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        let updatedAccounts = [];
    
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id !== id) {
                updatedAccounts.push(accounts[i]);
            }
        }
        
        // Save the updated list to localStorage
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        loadAccounts();
    };
    loadAccounts();
}

window.addEventListener('load', start, false);