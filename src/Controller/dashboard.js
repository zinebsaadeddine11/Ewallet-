import { findTransaction } from "../Model/Data.js";

const welcome_message = document.getElementById("welcome_message");
const balance = document.getElementById("balance");
const filtreTrans = document.getElementById("filtreTrans");
const tbody = document.getElementById("tbody");
const searchBar = document.getElementById("searchBar");
const payer = document.getElementById("payer");
const recharger = document.getElementById("recharger");

const user = JSON.parse(sessionStorage.getItem("user"));

// Initialize user info
if (user) {
    welcome_message.textContent = "Bonjour " + user.name;
    balance.textContent = user.balance + " DH";
}

// Function to render transactions
function renderTransactions(transactions) {
    tbody.innerHTML = "";
    
    if (!transactions || transactions.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 4;
        td.textContent = "Aucune transaction trouvée";
        td.style.textAlign = "center";
        td.style.padding = "20px";
        td.style.color = "#999";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    transactions.forEach((t) => {
        const tr = document.createElement("tr");
        const tdDate = document.createElement("td");
        tdDate.textContent = t.date;
        const tdTitle = document.createElement("td");
        tdTitle.textContent = t.title;
        const tdType = document.createElement("td");
        tdType.textContent = t.type;
        const tdAmount = document.createElement("td");
        tdAmount.textContent = t.amount + " DH";
        tr.append(tdDate, tdTitle, tdType, tdAmount);
        tbody.appendChild(tr);
    });
}

// Get filtered transactions based on current filter
function getFilteredTransactions() {
    if (!user || !user.transactions) return [];
    
    let transactions = [];
    const filterValue = filtreTrans.value;
    
    if (filterValue === "Entrée") {
        transactions = findTransaction(user, 1);
    } else if (filterValue === "Sortie") {
        transactions = findTransaction(user, 2);
    } else if (filterValue === "Toutes") {
        transactions = findTransaction(user, 3);
    }
    
    return transactions || [];
}

// Filter transactions by search term
function filterBySearch(transactions, searchTerm) {
    if (!searchTerm) return transactions;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return transactions.filter(t => {
        const titleMatch = t.title && t.title.toLowerCase().includes(lowerSearchTerm);
        const typeMatch = t.type && t.type.toLowerCase().includes(lowerSearchTerm);
        const dateMatch = t.date && t.date.includes(searchTerm);
        const amountMatch = t.amount && t.amount.toString().includes(searchTerm);
        
        return titleMatch || typeMatch || dateMatch || amountMatch;
    });
}

// Update display based on filter and search
function updateDisplay() {
    let transactions = getFilteredTransactions();
    const searchTerm = searchBar.value.trim();
    
    if (searchTerm) {
        transactions = filterBySearch(transactions, searchTerm);
    }
    
    renderTransactions(transactions);
}

// Filter change event
filtreTrans.addEventListener("change", updateDisplay);

// Search input event
searchBar.addEventListener("input", updateDisplay);

// Navigation buttons
payer.addEventListener("click", () => {
    window.location.href = "/src/View/Payer.html";
});

recharger.addEventListener("click", () => {
    window.location.href = "/src/View/Recharger.html";
});
const transferer=document.getElementById("transferer");
transferer.addEventListener("click",()=>{
  window.location.href="/src/View/Transferer.html";
});
// Initial display
if (user) {
    updateDisplay();
}