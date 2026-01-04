import { cards,transactions} from "../Model/Data.js";

const filtreTrans = document.getElementById("filtreTrans");
const tbody = document.getElementById("tbody");
const searchBar = document.getElementById("searchBar");

const user = JSON.parse(sessionStorage.getItem("user"));

function loadData() {
  if (!localStorage.getItem("ewallet_cards")) {
    localStorage.setItem("ewallet_cards", JSON.stringify(defaultCards));
    localStorage.setItem("ewallet_transactions", JSON.stringify(defaultTransactions));
  }
  return {
    cards: JSON.parse(localStorage.getItem("ewallet_cards")),
    transactions: JSON.parse(localStorage.getItem("ewallet_transactions"))
  };
}
if (!user) {
    alert("Vous devez vous connecter d'abord !");
    window.location.href = "/src/View/login.html";
}
function findCardsByUser(userId) {
  const data = loadData();
  return data.cards.filter(c => c.userId === userId);
}

function findTransactionsByCard(cardId) {
  const data = loadData();
  return data.transactions.filter(t => t.cardId === cardId);
}
function getAllUserTransactions() {
  if (!user) return [];

  const cards = findCardsByUser(user.id);
  let allTransactions = [];

  cards.forEach(card => {
    const transactions = findTransactionsByCard(card.id);
    allTransactions = allTransactions.concat(transactions);
  });

  return allTransactions;
}
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

  transactions.forEach(t => {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = t.date;

    const tdTitle = document.createElement("td");
    tdTitle.textContent = t.title;

    const tdType = document.createElement("td");
    tdType.textContent = t.type === "credit" ? "Entrée" : "Sortie";

    const tdAmount = document.createElement("td");
    tdAmount.textContent = t.amount + " DH";

    tr.append(tdDate, tdTitle, tdType, tdAmount);
    tbody.appendChild(tr);
  });
}
function getFilteredTransactions() {
  const allTransactions = getAllUserTransactions();
  const filterValue = filtreTrans.value;

  if (filterValue === "Entrée") return allTransactions.filter(t => t.type === "credit");
  if (filterValue === "Sortie") return allTransactions.filter(t => t.type === "debit");
  return allTransactions; 
}

function filterBySearch(transactions, searchTerm) {
  if (!searchTerm) return transactions;

  const lower = searchTerm.toLowerCase();

  return transactions.filter(t =>
    t.title.toLowerCase().includes(lower) ||
    t.type.toLowerCase().includes(lower) ||
    t.date.includes(searchTerm) ||
    t.amount.toString().includes(searchTerm)
  );
}
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

// Initial display
if (user) {
    updateDisplay();
}