import { cards, transactions } from "../Model/Data.js";

function loadData() {
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

function checkUser(user) {
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user);
        } else {
            reject("Vous devez vous connecter d'abord !");
        }
    });
}
// Récupérer les cartes actives de l'utilisateur
function getUserActiveCards(user) {
    const data = loadData();
    const userCards = data.cards.filter(c => c.userId === user.id && c.active);
    
    if (userCards.length === 0) {
        throw new Error("Aucune carte active disponible");
    }
    
    return userCards;
}
function validateAmount(amount) {
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0) {
            reject("Veuillez entrer un montant valide");
            return;
        }
        
        if (amount < 10) {
            reject("Le montant minimum de recharge est de 10 DH");
            return;
        }
        
        if (amount > 50000) {
            reject("Le montant maximum de recharge est de 50 000 DH");
            return;
        }
        
        resolve(amount);
    });
}

function validateCard(user, cardId) {
    return new Promise((resolve, reject) => {
        if (!cardId || cardId.trim() === "") {
            reject("Veuillez entrer l'ID de votre carte");
            return;
        }
        
        const data = loadData();
        const card = data.cards.find(c => c.id === parseInt(cardId) && c.userId === user.id);
        
        if (!card) {
            const availableCards = getUserActiveCards(user);
            const cardList = availableCards.map(c => `${c.id} (${c.type} ${c.lastFour})`).join(", ");
            reject(`Carte invalide. Vos cartes disponibles: ${cardList}`);
            return;
        }
        
        if (!card.active) {
            reject("Cette carte est bloquée. Veuillez utiliser une autre carte.");
            return;
        }
        
        resolve(card);
    });
}
function updateCardBalance(user,card, amount) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        const cardIndex = data.cards.findIndex(c => c.id === card.id);
        
        if (cardIndex !== -1) {
            user.balance-=amount;
            data.cards[cardIndex].balance += amount;
            sessionStorage.setItem('user',JSON.stringify(user));
            localStorage.setItem('ewallet_cards', JSON.stringify(data.cards));
            
            resolve(data.cards[cardIndex]);
        } else {
            reject("Erreur lors de la mise à jour du solde");
        }
    });
}

function addRechargeTransaction(cardId, amount) {
    return new Promise((resolve) => {
        const data = loadData();
        
        const newTransaction = {
            id: data.transactions.length + 1,
            cardId: cardId,
            type: "credit",
            title: "Recharge de compte",
            date: new Date().toLocaleDateString("fr-FR"),
            amount: amount,
            status: "succeeded"
        };
        
        data.transactions.push(newTransaction);
        
      
        localStorage.setItem('ewallet_transactions', JSON.stringify(data.transactions));
        
        resolve(newTransaction);
    });
}
export function rechargeAccount(user, amount, cardId) {
    return checkUser(user)
        .then(() => validateAmount(amount))
        .then(() => validateCard(user, cardId))
        .then((card) => {
            return updateCardBalance(user,card, amount)
                .then(() => addRechargeTransaction(card.id, amount));
        })
        .catch(error => {
            console.log("Erreur:", error);
            throw error;
        });
}
export function getActiveCards(user) {
    return checkUser(user)
        .then(() => getUserActiveCards(user))
        .catch(error => {
            console.log("Erreur:", error);
            throw error;
        });
}