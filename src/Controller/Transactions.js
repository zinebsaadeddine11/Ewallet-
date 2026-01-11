import { cards, cryptoAccounts, paypalAccounts, transactions } from "../Model/Data.js";

const welcome_message = document.getElementById("welcome_message");
const balance = document.getElementById("balance");
const filtreTrans = document.getElementById("filtreTrans");
const tbody = document.getElementById("tbody");
const searchBar = document.getElementById("searchBar");

const cardsContainer = document.getElementById("cardsContainer");
const cryptoContainer = document.getElementById("cryptoContainer");
const paypalContainer = document.getElementById("paypalContainer");

const user = JSON.parse(sessionStorage.getItem("user"));

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

if (user) {
  updateDisplay();
}