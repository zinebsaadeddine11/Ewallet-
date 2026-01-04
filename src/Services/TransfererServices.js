import { users, cards, transactions } from "../Model/Data.js";

export function checkUser(user) {
  return new Promise((resolve, reject) => {
    if (!user) reject("Vous devez vous connecter d'abord");
    resolve(user);
  });
}
export function validateAmount(amount, senderCard) {
  return new Promise((resolve, reject) => {
    if (!amount || amount <= 0) reject("Montant invalide");
    if (amount > senderCard.balance) reject("Solde insuffisant");
    resolve(amount);
  });
}

export function checkReceiver(email, senderEmail) {
  return new Promise((resolve, reject) => {
    if (!email) reject("Email requis");
    if (email === senderEmail) reject("Transfert vers soi-même interdit");

    const receiver = users.find(u => u.email === email);
    if (!receiver) reject("Destinataire introuvable");

    resolve(receiver);
  });
}

export function getActiveCard(userId) {
  return new Promise((resolve, reject) => {
    const card = cards.find(c => c.userId === userId && c.active);
    if (!card) reject("Aucune carte active trouvée");
    resolve(card);
  });
}

export function processTransfer({
  sender,
  receiver,
  senderCard,
  receiverCard,
  amount,
  description
}) {
  return new Promise(resolve => {
    senderCard.balance -= amount;
    receiverCard.balance += amount;

    transactions.push(
      {
        id: transactions.length + 1,
        cardId: senderCard.id,
        type: "debit",
        title: `Transfert vers ${receiver.name}`,
        date: new Date().toLocaleDateString("fr-FR"),
        amount,
        status: "succeeded"
      },
      {
        id: transactions.length + 2,
        cardId: receiverCard.id,
        type: "credit",
        title: `Transfert de ${sender.name}`,
        date: new Date().toLocaleDateString("fr-FR"),
        amount,
        status: "succeeded"
      }
    );
    
    resolve("Transfert effectué avec succès");
  });
}
