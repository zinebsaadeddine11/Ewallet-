export const users = [
  { id: 1, name: "Ahmed Bennani", email: "ahmed12@gmail.com", password: "1234", accountNumber: "MA1234567890123456" ,balance:200000},
  { id: 2, name: "Ahlam Zaidi", email: "ahlam34@gmail.com", password: "abcd", accountNumber: "MA9876543210987654",balance:54000 },
  { id: 3, name: "Yassine Idrissi", email: "yassine.dev@gmail.com", password: "pass123", accountNumber: "MA1122334455667788",balance:389000 },
  { id: 4, name: "Sara Alami", email: "sara21@gmail.com", password: "sara2025", accountNumber: "MA5544332211009988" ,balance:275800},
  { id: 5, name: "Omar Fassi", email: "omar.pro@gmail.com", password: "omar@321", accountNumber: "MA7788990011223344" ,balance:50000}
];

export const cards = [
  { id: 1, userId: 1, cardNumber: "**** **** **** 1111", lastFour: "1111", type: "Visa", expiry: "09/29", active: true, balance: 12000 },
  { id: 2, userId: 2, cardNumber: "**** **** **** 2222", lastFour: "2222", type: "MasterCard", expiry: "05/26", active: true, balance: 25600 },
  { id: 3, userId: 2, cardNumber: "**** **** **** 2225", lastFour: "2225", type: "MasterCard", expiry: "11/30", active: true, balance: 8500 },
  { id: 4, userId: 3, cardNumber: "**** **** **** 3333", lastFour: "3333", type: "Visa", expiry: "08/27", active: true, balance: 8400 },
  { id: 5, userId: 4, cardNumber: "**** **** **** 4444", lastFour: "4444", type: "Visa", expiry: "05/28", active: true, balance: 3100 },
  { id: 6, userId: 5, cardNumber: "**** **** **** 5555", lastFour: "5555", type: "MasterCard", expiry: "12/29", active: true, balance: 17800 }
];

export const transactions = [
  { id: 1, cardId: 1, type: "debit", title: "Bim Supermarché", date: "12/11/2025", amount: 100, status: "succeeded" },
  { id: 2, cardId: 1, type: "debit", title: "Restaurant La Villa", date: "12/12/2025", amount: 300, status: "succeeded" },
  { id: 3, cardId: 1, type: "credit", title: "Salaire Mensuel", date: "01/12/2025", amount: 8000, status: "succeeded" },
  { id: 4, cardId: 1, type: "debit", title: "Netflix Abonnement", date: "05/12/2025", amount: 120, status: "succeeded" },
  { id: 5, cardId: 2, type: "debit", title: "Marjane Market", date: "23/11/2025", amount: 600, status: "succeeded" },
  { id: 6, cardId: 2, type: "credit", title: "Virement de Yassine", date: "24/12/2025", amount: 250, status: "succeeded" },
  { id: 7, cardId: 2, type: "debit", title: "Zara Mode", date: "18/12/2025", amount: 1200, status: "succeeded" },
  { id: 8, cardId: 3, type: "debit", title: "Flormar Cosmétiques", date: "22/12/2025", amount: 600, status: "failed" },
  { id: 9, cardId: 3, type: "debit", title: "Carrefour", date: "28/12/2025", amount: 450, status: "succeeded" },
  { id: 10, cardId: 4, type: "credit", title: "Freelance Project", date: "10/12/2025", amount: 5000, status: "succeeded" },
  { id: 11, cardId: 4, type: "debit", title: "PC Gaming Setup", date: "15/12/2025", amount: 4200, status: "succeeded" },
  { id: 12, cardId: 4, type: "debit", title: "Spotify Premium", date: "20/12/2025", amount: 80, status: "succeeded" },
  { id: 13, cardId: 5, type: "credit", title: "Bourse d'études", date: "01/11/2025", amount: 2000, status: "succeeded" },
  { id: 14, cardId: 5, type: "debit", title: "Uber Course", date: "05/11/2025", amount: 90, status: "succeeded" },
  { id: 15, cardId: 5, type: "debit", title: "Glovo Livraison", date: "08/11/2025", amount: 150, status: "succeeded" },
  { id: 16, cardId: 6, type: "credit", title: "Prime Annuelle", date: "30/11/2025", amount: 3000, status: "succeeded" },
  { id: 17, cardId: 6, type: "debit", title: "Voyage Marrakech", date: "02/12/2025", amount: 5200, status: "succeeded" },
  { id: 18, cardId: 6, type: "debit", title: "Hotel Mogador", date: "03/12/2025", amount: 3400, status: "succeeded" },
  { id: 19, cardId: 6, type: "debit", title: "Taxi Aéroport", date: "04/12/2025", amount: 120, status: "succeeded" }
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
  return cards.find(c =>String(c.id )=== String(cardId));
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

/* Calculs de solde */
export function getTotalBalanceByUser(userId) {
  return cards
    .filter(c => c.userId === userId)
    .reduce((total, card) => total + card.balance, 0);
}
