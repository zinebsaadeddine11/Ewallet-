import { cards, transactions } from "../Model/Data.js";

const welcome_message = document.getElementById("welcome_message");
const balance = document.getElementById("balance");
const filtreTrans = document.getElementById("filtreTrans");
const tbody = document.getElementById("tbody");
const searchBar = document.getElementById("searchBar");

const payer = document.getElementById("payer");
const recharger = document.getElementById("recharger");
const transferer = document.getElementById("transferer");

const cardsContainer = document.getElementById("cardsContainer");

const user = JSON.parse(sessionStorage.getItem("user"));


function loadData() {
  const storedCards = localStorage.getItem('ewallet_cards');
  const storedTransactions = localStorage.getItem('ewallet_transactions');
  
  
  if (!storedCards) {
    localStorage.setItem('ewallet_cards', JSON.stringify(cards));
    localStorage.setItem('ewallet_transactions', JSON.stringify(transactions));
  }
  
  return {
    cards: JSON.parse(localStorage.getItem('ewallet_cards')),
    transactions: JSON.parse(localStorage.getItem('ewallet_transactions'))
  };
}

function findCardsByUser(userId) {
  const data = loadData();
  return data.cards.filter(c => c.userId === userId);
}

function findTransactionsByCard(cardId) {
  const data = loadData();
  return data.transactions.filter(t => t.cardId === cardId);
}

function getTotalBalanceByUser(userId) {
  const data = loadData();
  return data.cards
    .filter(c => c.userId === userId)
    .reduce((total, card) => total + card.balance, 0);
}


if (user) {
  welcome_message.textContent = "Bonjour " + user.name;
  balance.textContent = getTotalBalanceByUser(user.id) + " DH";
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

function getFilteredTransactions() {
  let transactions = getAllUserTransactions();
  const filterValue = filtreTrans.value;

  if (filterValue === "Entrée") {
    return transactions.filter(t => t.type === "credit");
  }

  if (filterValue === "Sortie") {
    return transactions.filter(t => t.type === "debit");
  }

  return transactions;
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

function updateDisplay() {
  let transactions = getFilteredTransactions();
  const searchTerm = searchBar.value.trim();

  if (searchTerm) {
    transactions = filterBySearch(transactions, searchTerm);
  }

  renderTransactions(transactions);
}

filtreTrans.addEventListener("change", updateDisplay);
searchBar.addEventListener("input", updateDisplay);

function renderCards() {
  if (!user) return;

  const userCards = findCardsByUser(user.id);
  cardsContainer.innerHTML = "";

  if (userCards.length === 0) {
    cardsContainer.innerHTML = "<p>Aucune carte associée</p>";
    return;
  }

  userCards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card-item");

    div.innerHTML = `
      <div class="card-item-header">
        <span>${card.type}</span>
        <span class="card-status ${card.active ? "active" : "inactive"}">
          ${card.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div class="card-number">${card.cardNumber}</div>

      <div class="card-item-footer">
        <span>Exp : ${card.expiry}</span>
        <strong>${card.balance} DH</strong>
      </div>
    `;

    cardsContainer.appendChild(div);
  });
}

payer.addEventListener("click", () => {
  window.location.href = "/src/View/Payer.html";
});

recharger.addEventListener("click", () => {
  window.location.href = "/src/View/Recharger.html";
});

transferer.addEventListener("click", () => {
  window.location.href = "/src/View/Transferer.html";
});

if (user) {
  renderCards();
  updateDisplay();
}