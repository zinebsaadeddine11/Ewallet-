export const users = [
  { id: 1, name: "Ahmed Bennani", email: "ahmed12@gmail.com", password: "1234", accountNumber: "MA1234567890123456", balance: 200000 },
  { id: 2, name: "Ahlam Zaidi", email: "ahlam34@gmail.com", password: "abcd", accountNumber: "MA9876543210987654", balance: 54000 },
  { id: 3, name: "Yassine Idrissi", email: "yassine.dev@gmail.com", password: "pass123", accountNumber: "MA1122334455667788", balance: 389000 },
  { id: 4, name: "Sara Alami", email: "sara21@gmail.com", password: "sara2025", accountNumber: "MA5544332211009988", balance: 275800 },
  { id: 5, name: "Omar Fassi", email: "omar.pro@gmail.com", password: "omar@321", accountNumber: "MA7788990011223344", balance: 50000 }
];

export const cards = [
  { id: 1, userId: 1, cardNumber: "**** **** **** 1111", lastFour: "1111", type: "Visa", expiry: "09/29", active: true, balance: 12000 },
  { id: 2, userId: 2, cardNumber: "**** **** **** 2222", lastFour: "2222", type: "MasterCard", expiry: "05/26", active: true, balance: 27900 },
  { id: 3, userId: 2, cardNumber: "**** **** **** 2225", lastFour: "2225", type: "MasterCard", expiry: "11/30", active: true, balance: 7500 },
  { id: 4, userId: 3, cardNumber: "**** **** **** 3333", lastFour: "3333", type: "Visa", expiry: "08/27", active: true, balance: 8400 },
  { id: 5, userId: 4, cardNumber: "**** **** **** 4444", lastFour: "4444", type: "Visa", expiry: "05/28", active: true, balance: 3100 },
  { id: 6, userId: 5, cardNumber: "**** **** **** 5555", lastFour: "5555", type: "MasterCard", expiry: "12/29", active: true, balance: 17800 }
];

export const cryptoAccounts = [
  { id: 1, userId: 1, currency: "Bitcoin", balance: 0.12, status: "active" },
  { id: 2, userId: 2, currency: "Ethereum", balance: 1.5, status: "active" },
  { id: 3, userId: 2, currency: "Stablecoin", balance: 5000, status: "active" },
  { id: 4, userId: 3, currency: "Ethereum", balance: 2.3, status: "active" },
  { id: 5, userId: 4, currency: "Stablecoin", balance: 2000, status: "active" },
  { id: 6, userId: 5, currency: "Bitcoin", balance: 0.9, status: "active" }
];

export const paypalAccounts = [
  { id: 1, userId: 1, email: "ahmed.paypal@gmail.com", balance: 1800, currency: "USD", status: "active" },
  { id: 6, userId: 1, email: "ahmed2.paypal@gmail.com", balance: 2000, currency: "USD", status: "active" },
  { id: 2, userId: 2, email: "ahlam.paypal@gmail.com", balance: 4500, currency: "EUR", status: "active" },
  { id: 3, userId: 3, email: "yassine.paypal@gmail.com", balance: 500, currency: "USD", status: "active" },
  { id: 4, userId: 4, email: "sara.paypal@gmail.com", balance: 600, currency: "USD", status: "active" },
  { id: 5, userId: 5, email: "omar.paypal@gmail.com", balance: 3500, currency: "USD", status: "active" }
];

export const transactions = [
  // ---- CARD 1 (Ahmed - userId: 1) ----
  { id: 1, accountId: 1, accountType: "card", type: "debit", title: "Bim Supermarché", date: "12/11/2025", amount: 100, status: "succeeded" },
  { id: 2, accountId: 1, accountType: "card", type: "debit", title: "Restaurant La Villa", date: "12/12/2025", amount: 300, status: "succeeded" },

  // ---- CARD 2 (Ahlam - userId: 2) ----
  { id: 3, accountId: 2, accountType: "card", type: "credit", title: "Salaire Mensuel", date: "01/12/2025", amount: 8000, status: "succeeded" },
  { id: 13, accountId: 2, accountType: "card", type: "debit", title: "Courses Marjane", date: "03/12/2025", amount: 450, status: "succeeded" },
  { id: 14, accountId: 2, accountType: "card", type: "debit", title: "Essence Total", date: "05/12/2025", amount: 350, status: "succeeded" },
  { id: 15, accountId: 2, accountType: "card", type: "credit", title: "Remboursement", date: "08/12/2025", amount: 200, status: "succeeded" },

  // ---- CARD 3 (Ahlam - userId: 2) ----
  { id: 16, accountId: 3, accountType: "card", type: "debit", title: "Restaurant Dar Beida", date: "02/12/2025", amount: 280, status: "succeeded" },
  { id: 17, accountId: 3, accountType: "card", type: "debit", title: "Pharmacie", date: "06/12/2025", amount: 120, status: "succeeded" },
  { id: 18, accountId: 3, accountType: "card", type: "credit", title: "Virement", date: "10/12/2025", amount: 600, status: "succeeded" },

  // ---- PAYPAL 1 (Ahmed - userId: 1) ----
  { id: 4, accountId: 1, accountType: "paypal", type: "debit", title: "Netflix Abonnement", date: "05/12/2025", amount: 120, status: "succeeded" },

  // ---- PAYPAL 2 (Ahlam - userId: 2) ----
  { id: 5, accountId: 2, accountType: "paypal", type: "credit", title: "Virement PayPal", date: "24/12/2025", amount: 450, status: "succeeded" },
  { id: 19, accountId: 2, accountType: "paypal", type: "debit", title: "Amazon Shopping", date: "15/12/2025", amount: 180, status: "succeeded" },
  { id: 20, accountId: 2, accountType: "paypal", type: "credit", title: "Freelance Payment", date: "18/12/2025", amount: 1200, status: "succeeded" },

  // ---- PAYPAL 3 (Yassine - userId: 3) ----
  { id: 6, accountId: 3, accountType: "paypal", type: "debit", title: "Spotify Premium", date: "20/12/2025", amount: 80, status: "succeeded" },

  // ---- CRYPTO 1 (Ahmed - userId: 1) ----
  { id: 7, accountId: 1, accountType: "crypto", type: "debit", title: "Paiement en Bitcoin", date: "18/12/2025", amount: 0.005, status: "succeeded" },

  // ---- CRYPTO 2 (Ahlam - userId: 2 - Ethereum) ----
  { id: 8, accountId: 2, accountType: "crypto", type: "credit", title: "Réception Ethereum", date: "22/12/2025", amount: 0.8, status: "succeeded" },
  { id: 21, accountId: 2, accountType: "crypto", type: "debit", title: "Trading Fee", date: "25/12/2025", amount: 0.02, status: "succeeded" },

  // ---- CRYPTO 3 (Ahlam - userId: 2 - Stablecoin) ----
  { id: 9, accountId: 3, accountType: "crypto", type: "debit", title: "Paiement USDT", date: "28/12/2025", amount: 250, status: "failed" },
  { id: 22, accountId: 3, accountType: "crypto", type: "credit", title: "Dépôt USDT", date: "29/12/2025", amount: 1000, status: "succeeded" },

  // ---- CARD 4 (Yassine - userId: 3) ----
  { id: 10, accountId: 4, accountType: "card", type: "debit", title: "PC Gaming Setup", date: "15/12/2025", amount: 4200, status: "succeeded" },

  // ---- PAYPAL 4 (Sara - userId: 4) ----
  { id: 11, accountId: 4, accountType: "paypal", type: "credit", title: "Freelance Payment", date: "10/12/2025", amount: 5000, status: "succeeded" },

  // ---- CRYPTO 5 (Sara - userId: 4) ----
  { id: 12, accountId: 5, accountType: "crypto", type: "credit", title: "Bourse en USDT", date: "01/11/2025", amount: 2000, status: "succeeded" }
];

/* Authentification */
export function findUser(email, password) {
  return users.find(u => u.email === email && u.password === password);
}

/* Gestion des cartes */
export function findCardsByUser(userId) {
  return cards.filter(c => c.userId === userId);
}

export function findCardById(cardId) {
  return cards.find(c => String(c.id) === String(cardId));
}

/* Gestion des transactions */
export function findTransactionsByCard(cardId) {
  return transactions.filter(t => t.cardId === cardId);
}

export function searchTransactions(cardId, keyword) {
  return transactions.filter(
    t => t.cardId === cardId &&
      t.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function filterTransactions(cardId, type) {
  if (type === "credit" || type === "debit") {
    return transactions.filter(t => t.cardId === cardId && t.type === type);
  }
  return findTransactionsByCard(cardId);
}