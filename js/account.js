function start() {
    const addAccountButton = document.getElementById('add-account');
    const accountCategory = document.getElementById('account-category');
    const accountName = document.getElementById('account-name');

    // Add Account
    addAccountButton.addEventListener('click', function () {
        const category = accountCategory.value.trim(); // Remove unnecessary whitespaces
        const name = accountName.value.trim();

        if (!name) {
            alert('Please enter a valid account name!');
            return;
        }

        // Create an account object
        const account = {
            category,
            name,
            id: Date.now() // Unique ID based on timestamp
        };

        // Save the account in localStorage
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        accounts.push(account);
        localStorage.setItem('accounts', JSON.stringify(accounts));

        // Reset the input fields
        accountName.value = '';

        // Reload the account lists
        loadAccounts();
    });

    // Load Accounts
    function loadAccounts() {
        // Fetch all accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        // Prepare HTML strings for each category
        let cashHtml = '';
        let bankHtml = '';
        let creditHtml = '';
        let savingsHtml = '';

        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const accountHtml = `
                <li>
                    ${account.name}
                    <button onclick="removeAccount(${account.id})">Remove</button>
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
        }

        // Update the HTML for each category
        document.getElementById('cash').innerHTML = cashHtml;
        document.getElementById('bank-account').innerHTML = bankHtml;
        document.getElementById('credit').innerHTML = creditHtml;
        document.getElementById('savings').innerHTML = savingsHtml;
    }

    // Remove an account
    window.removeAccount = function (id) {
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        
        // Create a new array to store the accounts after removal
        let updatedAccounts = [];
    
        // Loop through each account in the list
        for (let i = 0; i < accounts.length; i++) {
            // If the account's ID doesn't match the one to remove, add it to the updated array
            if (accounts[i].id !== id) {
                updatedAccounts.push(accounts[i]);
            }
        }
        
        // Save the updated list of accounts back to localStorage
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        
        // Reload the account list on the page
        loadAccounts();
    };

    // Initial load
    loadAccounts();
}

window.addEventListener('load', start, false);