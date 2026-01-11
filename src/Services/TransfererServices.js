import { users, cards, transactions, cryptoAccounts, paypalAccounts } from "../Model/Data.js";

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

export function checkUser(user) {
    return new Promise((resolve, reject) => {
        if (!user) reject("Vous devez vous connecter d'abord");
        else resolve(user);
    });
}

export function loadUserMethods(user) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        const userCards = data.cards.filter(c => c.userId === user.id && c.active);
        const userCrypto = data.cryptos.filter(c => c.userId === user.id && c.status === "active");
        const userPaypal = data.paypals.filter(p => p.userId === user.id && p.status === "active");

        const allMethods = [];


        userCards.forEach(card => {
            allMethods.push({
                id: card.id,
                type: "card",
                display: `💳 ${card.type} ${card.lastFour} • ${card.balance} DH`,
                balance: card.balance,
                currency: "DH"
            });
        });

     
        userCrypto.forEach(crypto => {
            let symbol = crypto.currency === "Bitcoin" ? "BTC" :
                crypto.currency === "Ethereum" ? "ETH" :
                    crypto.currency === "Stablecoin" ? "USDT" : crypto.currency;

            allMethods.push({
                id: crypto.id,
                type: "crypto",
                display: `₿ ${crypto.currency} • ${crypto.balance} ${symbol}`,
                balance: crypto.balance,
                currency: symbol
            });
        });

        userPaypal.forEach(paypal => {
            const maskedEmail = `****@${paypal.email.split("@")[1]}`;
            allMethods.push({
                id: paypal.id,
                type: "paypal",
                display: `💰 PayPal ${maskedEmail} • ${paypal.balance} ${paypal.currency}`,
                balance: paypal.balance,
                currency: paypal.currency
            });
        });

        if (allMethods.length === 0) {
            reject("Aucun moyen de paiement actif disponible");
        } else {
            resolve(allMethods);
        }
    });
}

export function validateAmount(amount, senderMethodValue) {
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0) {
            reject("Montant invalide");
            return;
        }

        if (!senderMethodValue) {
            reject("Veuillez sélectionner un moyen de paiement");
            return;
        }

        const [methodType, methodId] = senderMethodValue.split("-");
        const data = loadData();
        let senderMethod = null;

        if (methodType === "card") {
            senderMethod = data.cards.find(c => c.id === parseInt(methodId));
        } else if (methodType === "crypto") {
            senderMethod = data.cryptos.find(c => c.id === parseInt(methodId));
        } else if (methodType === "paypal") {
            senderMethod = data.paypals.find(p => p.id === parseInt(methodId));
        }

        if (!senderMethod) {
            reject("Moyen de paiement introuvable");
            return;
        }

        if (amount > senderMethod.balance) {
            reject(`Solde insuffisant (${senderMethod.balance} disponible)`);
            return;
        }

        resolve({ amount, senderMethod, methodType, methodId: parseInt(methodId) });
    });
}

export function checkReceiver(email, senderEmail) {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject("Email requis");
            return;
        }

        if (email === senderEmail) {
            reject("Transfert vers soi-même interdit");
            return;
        }

        const receiver = users.find(u => u.email === email);
        if (!receiver) {
            reject("Destinataire introuvable");
            return;
        }

        resolve(receiver);
    });
}
export function getReceiverMethod(receiver) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        
    
        const receiverCard = data.cards.find(c => c.userId === receiver.id && c.active);
        if (receiverCard) {
            resolve({ method: receiverCard, type: "card" });
            return;
        }

    
        const receiverPaypal = data.paypals.find(p => p.userId === receiver.id && p.status === "active");
        if (receiverPaypal) {
            resolve({ method: receiverPaypal, type: "paypal" });
            return;
        }

        
        const receiverCrypto = data.cryptos.find(c => c.userId === receiver.id && c.status === "active");
        if (receiverCrypto) {
            resolve({ method: receiverCrypto, type: "crypto" });
            return;
        }

        reject("Le destinataire n'a aucun moyen de paiement actif");
    });
}

export function processTransfer({
    sender,
    receiver,
    senderMethodId,
    senderMethodType,
    receiverMethodId,
    receiverMethodType,
    amount,
    description
}) {
    return new Promise((resolve, reject) => {
        const data = loadData();

        // Débiter l'expéditeur
        if (senderMethodType === "card") {
            const senderCardIndex = data.cards.findIndex(c => c.id === senderMethodId);
            if (senderCardIndex === -1) {
                reject("Carte d'expéditeur introuvable");
                return;
            }
            data.cards[senderCardIndex].balance -= amount;
            localStorage.setItem("ewallet_cards", JSON.stringify(data.cards));
        } else if (senderMethodType === "crypto") {
            const senderCryptoIndex = data.cryptos.findIndex(c => c.id === senderMethodId);
            if (senderCryptoIndex === -1) {
                reject("Compte crypto d'expéditeur introuvable");
                return;
            }
            data.cryptos[senderCryptoIndex].balance -= amount;
            localStorage.setItem("ewallet_crypto", JSON.stringify(data.cryptos));
        } else if (senderMethodType === "paypal") {
            const senderPaypalIndex = data.paypals.findIndex(p => p.id === senderMethodId);
            if (senderPaypalIndex === -1) {
                reject("Compte PayPal d'expéditeur introuvable");
                return;
            }
            data.paypals[senderPaypalIndex].balance -= amount;
            localStorage.setItem("ewallet_paypal", JSON.stringify(data.paypals));
        }

        // Créditer le destinataire
        if (receiverMethodType === "card") {
            const receiverCardIndex = data.cards.findIndex(c => c.id === receiverMethodId);
            if (receiverCardIndex === -1) {
                reject("Carte de destinataire introuvable");
                return;
            }
            data.cards[receiverCardIndex].balance += amount;
            localStorage.setItem("ewallet_cards", JSON.stringify(data.cards));
        } else if (receiverMethodType === "crypto") {
            const receiverCryptoIndex = data.cryptos.findIndex(c => c.id === receiverMethodId);
            if (receiverCryptoIndex === -1) {
                reject("Compte crypto de destinataire introuvable");
                return;
            }
            data.cryptos[receiverCryptoIndex].balance += amount;
            localStorage.setItem("ewallet_crypto", JSON.stringify(data.cryptos));
        } else if (receiverMethodType === "paypal") {
            const receiverPaypalIndex = data.paypals.findIndex(p => p.id === receiverMethodId);
            if (receiverPaypalIndex === -1) {
                reject("Compte PayPal de destinataire introuvable");
                return;
            }
            data.paypals[receiverPaypalIndex].balance += amount;
            localStorage.setItem("ewallet_paypal", JSON.stringify(data.paypals));
        }

    
        const title = description || "Transfert";
        
        data.transactions.push(
            {
                id: data.transactions.length + 1,
                accountId: senderMethodId,
                accountType: senderMethodType,
                type: "debit",
                title: `${title} vers ${receiver.name}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount,
                status: "succeeded"
            },
            {
                id: data.transactions.length + 2,
                accountId: receiverMethodId,
                accountType: receiverMethodType,
                type: "credit",
                title: `${title} de ${sender.name}`,
                date: new Date().toLocaleDateString("fr-FR"),
                amount,
                status: "succeeded"
            }
        );

        localStorage.setItem("ewallet_transactions", JSON.stringify(data.transactions));
        resolve("Transfert effectué avec succès");
    });
}