import { transactions,cards } from "../Model/Data.js";

export function checkUser(user)
{
    return new Promise((resolve,reject)=>{
        if(user)
            resolve(user);
        else
            reject("Vous devez vous connecter!");
    });
}
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
export function validatePayment(amount, beneficiary, selectedCard) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        const currentCard = data.cards.find(c => c.id === selectedCard.id);
        if (!currentCard) {
            reject("Carte introuvable");
            return;
        }
        
        if (!currentCard.active) {
            reject("Cette carte est désactivée");
            return;
        }
        if (!amount || amount <= 0)
            reject("Veuillez entrer un montant valide");
        else if (!beneficiary)
            reject("Veuillez entrer le nom du bénéficiaire");
        else if (!currentCard)
            reject("Veuillez sélectionner une carte");
        else if (amount > currentCard.balance)
            reject(`Solde insuffisant sur la carte (${currentCard.balance} DH)`);
        else
            resolve({ amount, beneficiary, selectedCard:currentCard });
    });
}
export function loadUserCards(user,cardSelect)
{
    return new Promise((resolve,reject)=>
    {
        const data=loadData();
        const userCards=data.cards.filter(c=>c.userId===user.id && c.active);
    if(userCards.length===0)
    {
        reject("Aucune carte active disponible");
    }
    else
    {
        
        userCards.forEach(card => {
            const option=document.createElement("option");
            option.value=card.id;
            option.textContent=`${card.type} ${card.lastFour} • ${card.balance.toLocaleString()} DH`;
            cardSelect.appendChild(option);
        });
        resolve();
    }
    });
}
export function processPayment({ amount, beneficiary, selectedCard })
{
    return new Promise((resolve,reject)=>
    {
        const data=loadData();
        const cardIndex=data.cards.findIndex(c=>c.id===selectedCard.id);
         if (cardIndex === -1) {
            reject("Carte introuvable lors du traitement");
            return;
        }
        if (data.cards[cardIndex].balance < amount) {
            reject("Solde insuffisant");
            return;
        }
            data.cards[cardIndex].balance-=amount;
        
         const newTransaction = {
                id: data.transactions.length + 1,
                cardId: selectedCard.id,
                type: "debit",
                title: `Paiement à ${beneficiary}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount: amount,
                status: "succeeded"
            };
        data.transactions.push(newTransaction);
        localStorage.setItem('ewallet_cards', JSON.stringify(data.cards));
        localStorage.setItem('ewallet_transactions', JSON.stringify(data.transactions));
        resolve();
    });
}