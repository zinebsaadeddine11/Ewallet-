import {cards, cryptoAccounts, paypalAccounts, transactions } from "../Model/Data.js";

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

if (user) {
    welcome_message.textContent = "Bonjour " + user.name;
    balance.textContent = user.balance + " DH";
    if(user.balance >0)
    {
      balance.style.color="#12a012ff";
    }
    else
    {
      balance.style.color="red";
    }
}

function loadData() {
  if (!localStorage.getItem('ewallet_cards')) {
    localStorage.setItem('ewallet_cards', JSON.stringify(cards));
  }

  if (!localStorage.getItem('ewallet_crypto')) {
    localStorage.setItem('ewallet_crypto', JSON.stringify(cryptoAccounts));
  }

  if (!localStorage.getItem('ewallet_paypal')) {
    localStorage.setItem('ewallet_paypal', JSON.stringify(paypalAccounts));
  }

  if (!localStorage.getItem('ewallet_transactions')) {
    localStorage.setItem('ewallet_transactions', JSON.stringify(transactions));
  }

  return {
    cards: JSON.parse(localStorage.getItem('ewallet_cards')),
    cryptos: JSON.parse(localStorage.getItem('ewallet_crypto')),
    paypals: JSON.parse(localStorage.getItem('ewallet_paypal')),
    transactions: JSON.parse(localStorage.getItem('ewallet_transactions'))
  };
}


function findCardsByUser(userId) {
  const data = loadData();
  return data.cards.filter(c => c.userId === userId);
}
function findCryptoByUser(userId)
{
  const data = loadData();
  return data.cryptos.filter(cr=>cr.userId===userId);
}
function findPaypalByUser(userId)
{
  const data = loadData();
  return data.paypals.filter(p=>p.userId===userId);
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
    tdType.style.color = t.type === "credit" ? "green" : "red";
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
function renderCryptos() {
  if (!user) return;

  const userCryptos = findCryptoByUser(user.id);
  cryptoContainer.innerHTML = "";

  if (userCryptos.length === 0) {
    cryptoContainer.innerHTML = "<p>Aucun compte crypto associé</p>";
    return;
  }

  userCryptos.forEach(crypto => {
    const div = document.createElement("div");
    div.classList.add("card-item");

    div.innerHTML = `
      <div class="card-item-header">
        <span>${crypto.currency}</span>
        <span class="card-status ${crypto.status ? "active" : "inactive"}">
          ${crypto.status ? "Active" : "Inactive"}
        </span>
      </div>

      <div class="card-item-footer">
        <strong>${crypto.balance} </strong>
      </div>
    `;

    cryptoContainer.appendChild(div);
  });
}
function renderPaypals() {
  if (!user) return;

  const userPaypals = findPaypalByUser(user.id);
  paypalContainer.innerHTML = "";

  if (userPaypals.length === 0) {
    paypalContainer.innerHTML = "<p>Aucun compte paypal associé</p>";
    return;
  }

  userPaypals.forEach(paypal => {
    const div = document.createElement("div");
    div.classList.add("card-item");

    div.innerHTML = `
      <div class="card-item-header">
      <span></span>
        <span class="card-status ${paypal.status ? "active" : "inactive"}">
          ${paypal.status ? "Active" : "Inactive"}
        </span>
      </div>

      <div class="card-number" style="font-size: 14px; word-break: break-all;"> ****@${paypal.email.split("@")[1]}</div>

      <div class="card-item-footer">
        <strong>${paypal.balance} ${paypal.currency}</strong>
      </div>
    `;

    paypalContainer.appendChild(div);
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
  renderCryptos();
  renderPaypals();
  updateDisplay();
}