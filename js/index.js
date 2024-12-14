/*// Tab switching logic
const tabs = document.querySelectorAll(".navbar li");
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
    document.querySelectorAll(".navbar li");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    selectedTab.classList.add("active");
}

// Helper function to update the section title or navigate to other pages
function updateSection(tabId) {
    const sectionTitle = document.getElementById("section-title");
    const pageMapping = {
        "dashboard-tab": {title: "Dashboard", page: "index.html"},
        "transaction-tab": {title: "Transactions", page: "transaction.html"},
        "account-tab": {title: "Accounts", page: "account.html"}
    }
    
    const current = pageMapping[tabId];
    if (current) {
        if (current.page) {
            window.location.href = current.page;
        }
        else {
            sectionTitle.textContent = current.title;
        }
    }
}*/