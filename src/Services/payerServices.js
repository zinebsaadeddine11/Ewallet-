import { transactions, cards, cryptoAccounts, paypalAccounts } from "../Model/Data.js";

export function checkUser(user) {
    return new Promise((resolve, reject) => {
        if (user)
            resolve(user);
        else
            reject("Vous devez vous connecter!");
    });
}

export function loadData() {
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

export function validatePayment(amount, beneficiary, selectedMethodId, methodType) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        
        let currentMethod = null;
        let methodName = "";

        // Trouver le moyen de paiement selon le type
        if (methodType === "card") {
            currentMethod = data.cards.find(c => c.id === parseInt(selectedMethodId));
            if (!currentMethod) {
                reject("Carte introuvable");
                return;
            }
            if (!currentMethod.active) {
                reject("Cette carte est désactivée");
                return;
            }
            methodName = "carte";
        } else if (methodType === "crypto") {
            currentMethod = data.cryptos.find(c => c.id === parseInt(selectedMethodId));
            if (!currentMethod) {
                reject("Compte crypto introuvable");
                return;
            }
            if (currentMethod.status !== "active") {
                reject("Ce compte crypto est désactivé");
                return;
            }
            methodName = "crypto";
        } else if (methodType === "paypal") {
            currentMethod = data.paypals.find(p => p.id === parseInt(selectedMethodId));
            if (!currentMethod) {
                reject("Compte PayPal introuvable");
                return;
            }
            if (currentMethod.status !== "active") {
                reject("Ce compte PayPal est désactivé");
                return;
            }
            methodName = "PayPal";
        }

        // Validations générales
        if (!amount || amount <= 0) {
            reject("Veuillez entrer un montant valide");
            return;
        }
        if (!beneficiary) {
            reject("Veuillez entrer le nom du bénéficiaire");
            return;
        }
        if (!currentMethod) {
            reject("Veuillez sélectionner un moyen de paiement");
            return;
        }
        if (amount > currentMethod.balance) {
            reject(`Solde insuffisant sur ${methodName} (${currentMethod.balance} DH)`);
            return;
        }

        resolve({ amount, beneficiary, selectedMethod: currentMethod, methodType });
    });
}

export function loadUserPaymentMethods(user, moyenSelect) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        const userCards = data.cards.filter(c => c.userId === user.id && c.active);
        const userCrypto = data.cryptos.filter(c => c.userId === user.id && c.status === "active");
        const userPaypal = data.paypals.filter(p => p.userId === user.id && p.status === "active");

        let totalMethods = 0;

        // Ajouter les cartes
        if (userCards.length > 0) {
            userCards.forEach(card => {
                const option = document.createElement("option");
                option.value = `card-${card.id}`;
                option.textContent = `💳 ${card.type} ${card.lastFour} • ${card.balance.toLocaleString()} DH`;
                moyenSelect.appendChild(option);
                totalMethods++;
            });
        }

        // Ajouter les comptes crypto
        if (userCrypto.length > 0) {
            userCrypto.forEach(cr => {
                const option = document.createElement("option");
                option.value = `crypto-${cr.id}`;
                option.textContent = ` 💵 ${cr.currency} • ${cr.balance}`;
                moyenSelect.appendChild(option);
                totalMethods++;
            });
        }

        // Ajouter les comptes PayPal
        if (userPaypal.length > 0) {
            userPaypal.forEach(pp => {
                const option = document.createElement("option");
                option.value = `paypal-${pp.id}`;
                const maskedEmail = `****@${pp.email.split("@")[1]}`;
                option.textContent = `💰 PayPal ${maskedEmail} • ${pp.balance} ${pp.currency}`;
                moyenSelect.appendChild(option);
                totalMethods++;
            });
        }

        if (totalMethods === 0) {
            reject("Aucun moyen de paiement actif disponible");
        } else {
            resolve();
        }
    });
}

export function processPayment({ amount, beneficiary, selectedMethod, methodType }) {
    return new Promise((resolve, reject) => {
        const data = loadData();

        if (methodType === "card") {
            const cardIndex = data.cards.findIndex(c => c.id === selectedMethod.id);
            if (cardIndex === -1) {
                reject("Carte introuvable lors du traitement");
                return;
            }
            if (data.cards[cardIndex].balance < amount) {
                reject("Solde insuffisant");
                return;
            }

            data.cards[cardIndex].balance -= amount;

            const newTransaction = {
                id: data.transactions.length + 1,
                accountId: selectedMethod.id,
                accountType: "card",
                type: "debit",
                title: `Paiement à ${beneficiary}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount: amount,
                status: "succeeded"
            };

            data.transactions.push(newTransaction);
            localStorage.setItem('ewallet_cards', JSON.stringify(data.cards));
            localStorage.setItem('ewallet_transactions', JSON.stringify(data.transactions));

        } else if (methodType === "crypto") {
            const cryptoIndex = data.cryptos.findIndex(c => c.id === selectedMethod.id);
            if (cryptoIndex === -1) {
                reject("Compte crypto introuvable lors du traitement");
                return;
            }
            if (data.cryptos[cryptoIndex].balance < amount) {
                reject("Solde insuffisant");
                return;
            }

            data.cryptos[cryptoIndex].balance -= amount;

            const newTransaction = {
                id: data.transactions.length + 1,
                accountId: selectedMethod.id,
                accountType: "crypto",
                type: "debit",
                title: `Paiement à ${beneficiary}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount: amount,
                status: "succeeded"
            };

            data.transactions.push(newTransaction);
            localStorage.setItem('ewallet_crypto', JSON.stringify(data.cryptos));
            localStorage.setItem('ewallet_transactions', JSON.stringify(data.transactions));

        } else if (methodType === "paypal") {
            const paypalIndex = data.paypals.findIndex(p => p.id === selectedMethod.id);
            if (paypalIndex === -1) {
                reject("Compte PayPal introuvable lors du traitement");
                return;
            }
            if (data.paypals[paypalIndex].balance < amount) {
                reject("Solde insuffisant");
                return;
            }

            data.paypals[paypalIndex].balance -= amount;

            const newTransaction = {
                id: data.transactions.length + 1,
                accountId: selectedMethod.id,
                accountType: "paypal",
                type: "debit",
                title: `Paiement à ${beneficiary}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount: amount,
                status: "succeeded"
            };

            data.transactions.push(newTransaction);
            localStorage.setItem('ewallet_paypal', JSON.stringify(data.paypals));
            localStorage.setItem('ewallet_transactions', JSON.stringify(data.transactions));
        }

        resolve();
    });
}