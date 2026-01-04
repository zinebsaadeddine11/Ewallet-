import { cards, transactions } from "../Model/Data.js";

const paymentForm = document.getElementById("paymentForm");
const amountInput = document.getElementById("amount");
const beneficiaryInput = document.getElementById("beneficiary");
const payBtn = document.getElementById("payBtn");
const RtrBtn = document.getElementById("RtrBtn");
const errorMessage = document.getElementById("errorMessage");
const cardSelect = document.getElementById("cardSelect");

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

function checkUser(user) {
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user);
        } else {
            reject("Vous devez vous connecter d'abord !");
        }
    });
}

function loadUserCards() {
    const data = loadData();
    const userCards = data.cards.filter(c => c.userId === user.id && c.active);

    if (userCards.length === 0) {
        showError("Aucune carte active disponible");
        payBtn.disabled = true;
        return;
    }

    userCards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = `${card.type} ${card.lastFour} • ${card.balance.toLocaleString()} DH`;
        cardSelect.appendChild(option);
    });
}

checkUser(user).then(loadUserCards).catch((error) => {
    console.log(error);
    window.location.href = "/src/View/login.html";
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");

    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 4000);
}

function validatePayment(amount, beneficiary, selectedCard) {
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0)
            reject("Veuillez entrer un montant valide");
        else if (!beneficiary)
            reject("Veuillez entrer le nom du bénéficiaire");
        else if (!selectedCard)
            reject("Veuillez sélectionner une carte");
        else if (amount > selectedCard.balance)
            reject(`Solde insuffisant sur la carte (${selectedCard.balance} DH)`);
        else
            resolve({ amount, beneficiary, selectedCard });
    });
}

function processPayment({ amount, beneficiary, selectedCard }) {
    return new Promise(resolve => {
        payBtn.disabled = true;
        payBtn.classList.add("loading");
        payBtn.textContent = "Traitement en cours";

        setTimeout(() => {
            const data = loadData();
            
            
            const cardIndex = data.cards.findIndex(c => c.id === selectedCard.id);
            
            if (cardIndex !== -1) {
                data.cards[cardIndex].balance -= amount;
            }

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
        }, 1500);
    });
}

function handleSuccess() {
    payBtn.classList.remove("loading");
    payBtn.textContent = "✓ Paiement réussi !";
    payBtn.style.background = "#2ecc71";

    setTimeout(() => {
        window.location.href = "/src/View/dashboard.html";
    }, 1500);
}

paymentForm.addEventListener("submit", e => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const beneficiary = beneficiaryInput.value.trim();
    const cardId = parseInt(cardSelect.value);

    const data = loadData();
    const selectedCard = data.cards.find(c => c.id === cardId);

    validatePayment(amount, beneficiary, selectedCard)
        .then(processPayment)
        .then(handleSuccess)
        .catch(showError);
});

RtrBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});