import { users, cards, transactions } from "../Model/Data.js";
export function loadData() {
    const storedCards = localStorage.getItem('ewallet_cards');
    
    if (!storedCards) {
        localStorage.setItem('ewallet_cards', JSON.stringify(cards));
        localStorage.setItem('ewallet_transactions', JSON.stringify(transactions));
    }
    
    return {
        cards: JSON.parse(localStorage.getItem('ewallet_cards')),
        transactions: JSON.parse(localStorage.getItem('ewallet_transactions'))
    };
}
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
export function loadCards(user,cardHolder)
{
  return new Promise((resolve,reject)=>{
    const data=loadData();
    const UserCard=data.cards.filter(c=>c.userId===user.id && c.active);

    if(UserCard.length===0)
    {
      reject("Aucune carte n'est trouvé!");
    }
    else
    {
      UserCard.forEach(card => {
      const option=document.createElement("option");
      option.value=card.id;
      option.textContent=`${card.type} ${card.lastFour} • ${card.balance} DH`;
      cardHolder.appendChild(option);
      });
      resolve();
    }
  });
}
export function getActiveCard(userId) {
  return new Promise((resolve, reject) => {
    const data = loadData();
    const card = data.cards.find(c => c.userId === userId && c.active);
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
}) {
  return new Promise(resolve => {
    const data =loadData();
    const sCard = data.cards.find(c => c.id === senderCard.id);
    const rCard = data.cards.find(c => c.id === receiverCard.id);
    sCard.balance -= amount;
    rCard.balance += amount;

    data.transactions.push(
      {
        id: data.transactions.length + 1,
        cardId: sCard.id,
        type: "debit",
        title: `Transfert vers ${receiver.name}`,
        date: new Date().toLocaleDateString("fr-FR"),
        amount,
        status: "succeeded"
      },
      {
        id: data.transactions.length + 2,
        cardId: rCard.id,
        type: "credit",
        title: `Transfert de ${sender.name}`,
        date: new Date().toLocaleDateString("fr-FR"),
        amount,
        status: "succeeded"
      }
      
    );
    localStorage.setItem("ewallet_cards", JSON.stringify(data.cards));
    localStorage.setItem("ewallet_transactions", JSON.stringify(data.transactions));
    resolve("Transfert effectué avec succès");
  });
}