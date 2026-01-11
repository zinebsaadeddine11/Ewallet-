import { cards, cryptoAccounts, paypalAccounts, transactions } from "../Model/Data.js";

const welcome_message = document.getElementById("welcome_message");
const balance = document.getElementById("balance");
const filtreTrans = document.getElementById("filtreTrans");
const tbody = document.getElementById("tbody");
const searchBar = document.getElementById("searchBar");

const payer = document.getElementById("payer");
const recharger = document.getElementById("recharger");
const transferer = document.getElementById("transferer");

const cardsContainer = document.getElementById("cardsContainer");
const cryptoContainer = document.getElementById("cryptoContainer");
const paypalContainer = document.getElementById("paypalContainer");

const user = JSON.parse(sessionStorage.getItem("user"));

if (user) {
  welcome_message.textContent = "Bonjour " + user.name;
  balance.textContent = user.balance + " DH";
  balance.style.color = user.balance > 0 ? "#12a012ff" : "red";
}

function loadData() {
  if (!localStorage.getItem("ewallet_cards"))
    localStorage.setItem("ewallet_cards", JSON.stringify(cards));

  if (!localStorage.getItem("ewallet_crypto"))
    localStorage.setItem("ewallet_crypto", JSON.stringify(cryptoAccounts));

  if (!localStorage.getItem("ewallet_paypal"))
    localStorage.setItem("ewallet_paypal", JSON.stringify(paypalAccounts));

  if (!localStorage.getItem("ewallet_transactions"))
    localStorage.setItem("ewallet_transactions", JSON.stringify(transactions));

  return {
    cards: JSON.parse(localStorage.getItem("ewallet_cards")),
    cryptos: JSON.parse(localStorage.getItem("ewallet_crypto")),
    paypals: JSON.parse(localStorage.getItem("ewallet_paypal")),
    transactions: JSON.parse(localStorage.getItem("ewallet_transactions"))
  };
}

const DATA = loadData();

const findCardsByUser = id => DATA.cards.filter(c => c.userId === id);
const findCryptoByUser = id => DATA.cryptos.filter(c => c.userId === id);
const findPaypalByUser = id => DATA.paypals.filter(p => p.userId === id);

const findTransactionsByType = (accountId, type) =>
  DATA.transactions.filter(
    t => t.accountId === accountId && t.accountType === type
  );

function getCurrencyForTransaction(transaction) {
  if (transaction.accountType === "card") {
    return "DH";
  } else if (transaction.accountType === "crypto") {
    const cryptoAccount = DATA.cryptos.find(c => c.id === transaction.accountId);
    if (cryptoAccount) {
     
      if (cryptoAccount.currency === "Bitcoin") return "BTC";
      if (cryptoAccount.currency === "Ethereum") return "ETH";
      if (cryptoAccount.currency === "Stablecoin") return "USDT";
      return cryptoAccount.currency;
    }
    return "CRYPTO";
  } else if (transaction.accountType === "paypal") {
    const paypalAccount = DATA.paypals.find(p => p.id === transaction.accountId);
    return paypalAccount ? paypalAccount.currency : "USD";
  }
  return "DH";
}

function getAllUserTransactions() {
  if (!user) return [];

  let all = [];

  findCardsByUser(user.id).forEach(c =>
    all.push(...findTransactionsByType(c.id, "card"))
  );

  findCryptoByUser(user.id).forEach(c =>
    all.push(...findTransactionsByType(c.id, "crypto"))
  );

  findPaypalByUser(user.id).forEach(p =>
    all.push(...findTransactionsByType(p.id, "paypal"))
  );

  return all;
}

function getFilteredTransactions() {
  const value = filtreTrans.value;
  const all = getAllUserTransactions();

  if (value === "Entrée") return all.filter(t => t.type === "credit");
  if (value === "Sortie") return all.filter(t => t.type === "debit");

  return all;
}

function filterBySearch(trans, term) {
  if (!term) return trans;
  const l = term.toLowerCase();

  return trans.filter(t =>
    t.title.toLowerCase().includes(l) ||
    t.type.toLowerCase().includes(l) ||
    t.accountType.toLowerCase().includes(l) ||
    t.date.includes(term) ||
    t.amount.toString().includes(term)
  );
}

function renderTransactions(transactions) {
  tbody.innerHTML = "";

  if (!transactions.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:#999;padding:20px">
          Aucune transaction trouvée
        </td>
      </tr>`;
    return;
  }

  transactions.forEach(t => {
    const tr = document.createElement("tr");
    const currency = getCurrencyForTransaction(t);
    
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.title}</td>
      <td style="color:${t.type === "credit" ? "green" : "red"}">
        ${t.type === "credit" ? "Entrée" : "Sortie"}
      </td>
      <td>${t.amount} ${currency}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateDisplay() {
  let trans = getFilteredTransactions();
  trans = filterBySearch(trans, searchBar.value.trim());
  renderTransactions(trans);
}

filtreTrans.addEventListener("change", updateDisplay);
searchBar.addEventListener("input", updateDisplay);

function renderCards() {
  const cards = findCardsByUser(user.id);
  cardsContainer.innerHTML = cards.length
    ? ""
    : "<p>Aucune carte associée</p>";

  cards.forEach(c => {
    cardsContainer.innerHTML += `
      <div class="card-item">
        <div class="card-item-header">
          <span>${c.type}</span>
          <span class="card-status ${c.active ? "active" : "inactive"}">
            ${c.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div class="card-number">${c.cardNumber}</div>
        <div class="card-item-footer">
          <span>Exp : ${c.expiry}</span>
          <strong>${c.balance} DH</strong>
        </div>
      </div>`;
  });
}

function renderCryptos() {
  const cryptos = findCryptoByUser(user.id);
  cryptoContainer.innerHTML = cryptos.length
    ? ""
    : "<p>Aucun compte crypto associé</p>";

  cryptos.forEach(c => {
    let symbol = "";
    if (c.currency === "Bitcoin") symbol = "BTC";
    else if (c.currency === "Ethereum") symbol = "ETH";
    else if (c.currency === "Stablecoin") symbol = "USDT";
    else symbol = c.currency;

    cryptoContainer.innerHTML += `
      <div class="card-item">
        <div class="card-item-header">
          <span>${c.currency}</span>
          <span class="card-status ${c.status ? "active" : "inactive"}">
            ${c.status ? "Active" : "Inactive"}
          </span>
        </div>
        <div class="card-item-footer">
          <strong>${c.balance} ${symbol}</strong>
        </div>
      </div>`;
  });
}

const maskEmail = email => `****@${email.split("@")[1]}`;

function renderPaypals() {
  const paypals = findPaypalByUser(user.id);
  paypalContainer.innerHTML = paypals.length
    ? ""
    : "<p>Aucun compte paypal associé</p>";

  paypals.forEach(p => {
    paypalContainer.innerHTML += `
      <div class="card-item">
        <div class="card-item-header">
          <span></span>
          <span class="card-status ${p.status ? "active" : "inactive"}">
            ${p.status ? "Active" : "Inactive"}
          </span>
        </div>
        <div class="card-number">${maskEmail(p.email)}</div>
        <div class="card-item-footer">
          <strong>${p.balance} ${p.currency}</strong>
        </div>
      </div>`;
  });
}

payer.onclick = () => location.href = "/src/View/Payer.html";
recharger.onclick = () => location.href = "/src/View/Recharger.html";
transferer.onclick = () => location.href = "/src/View/Transferer.html";

if (user) {
  renderCards();
  renderCryptos();
  renderPaypals();
  updateDisplay();
}