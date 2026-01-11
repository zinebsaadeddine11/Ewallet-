import { cards, transactions, paypalAccounts, cryptoAccounts } from "../Model/Data.js";

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

function checkUser(user) {
    return new Promise((resolve, reject) => {
        if (user) {
            resolve(user);
        } else {
            reject("Vous devez vous connecter d'abord !");
        }
    });
}
function getUserActiveMethods(user) {
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
        throw new Error("Aucun moyen de paiement actif disponible");
    }

    return allMethods;
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

function validateMethod(user, methodValue) {
    return new Promise((resolve, reject) => {
        if (!methodValue || methodValue.trim() === "") {
            reject("Veuillez sélectionner un moyen de paiement");
            return;
        }

       
        const [methodType, methodId] = methodValue.split("-");
        const id = parseInt(methodId);
        const data = loadData();

        let method = null;

        if (methodType === "card") {
            method = data.cards.find(c => c.id === id && c.userId === user.id);
            if (!method) {
                reject("Carte invalide");
                return;
            }
            if (!method.active) {
                reject("Cette carte est désactivée");
                return;
            }
        } else if (methodType === "crypto") {
            method = data.cryptos.find(c => c.id === id && c.userId === user.id);
            if (!method) {
                reject("Compte crypto invalide");
                return;
            }
            if (method.status !== "active") {
                reject("Ce compte crypto est désactivé");
                return;
            }
        } else if (methodType === "paypal") {
            method = data.paypals.find(p => p.id === id && p.userId === user.id);
            if (!method) {
                reject("Compte PayPal invalide");
                return;
            }
            if (method.status !== "active") {
                reject("Ce compte PayPal est désactivé");
                return;
            }
        } else {
            reject("Type de moyen de paiement invalide");
            return;
        }

        resolve({ method, methodType, methodId: id });
    });
}

function updateMethodBalance(user, methodInfo, amount) {
    return new Promise((resolve, reject) => {
        const data = loadData();
        const { methodType, methodId } = methodInfo;

        
        if (user.balance < amount) {
            reject(`Solde insuffisant sur votre compte principal (${user.balance} DH disponible)`);
            return;
        }

        if (methodType === "card") {
            const cardIndex = data.cards.findIndex(c => c.id === methodId);
            if (cardIndex !== -1) {
                user.balance -= amount;
                data.cards[cardIndex].balance += amount;
                sessionStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('ewallet_cards', JSON.stringify(data.cards));
                resolve({ updatedMethod: data.cards[cardIndex], methodType });
            } else {
                reject("Erreur lors de la mise à jour du solde de la carte");
            }
        } else if (methodType === "crypto") {
            const cryptoIndex = data.cryptos.findIndex(c => c.id === methodId);
            if (cryptoIndex !== -1) {
                user.balance -= amount;

                data.cryptos[cryptoIndex].balance += amount / 10000; 
                sessionStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('ewallet_crypto', JSON.stringify(data.cryptos));
                resolve({ updatedMethod: data.cryptos[cryptoIndex], methodType });
            } else {
                reject("Erreur lors de la mise à jour du solde crypto");
            }
        } else if (methodType === "paypal") {
            const paypalIndex = data.paypals.findIndex(p => p.id === methodId);
            if (paypalIndex !== -1) {
                user.balance -= amount;
                
                const conversionRate = data.paypals[paypalIndex].currency === "EUR" ? 0.09 : 0.1;
                data.paypals[paypalIndex].balance += amount * conversionRate;
                sessionStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('ewallet_paypal', JSON.stringify(data.paypals));
                resolve({ updatedMethod: data.paypals[paypalIndex], methodType });
            } else {
                reject("Erreur lors de la mise à jour du solde PayPal");
            }
        }
    });
}

function addRechargeTransaction(methodInfo, amount) {
    return new Promise((resolve) => {
        const data = loadData();
        const { methodId, methodType } = methodInfo;

        const newTransaction = {
            id: data.transactions.length + 1,
            accountId: methodId,
            accountType: methodType,
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

export async function rechargeAccount(user, amount, methodValue) {
    try {
        const authenticatedUser = await checkUser(user);
        await validateAmount(amount);
        const methodInfo = await validateMethod(authenticatedUser, methodValue);
        await updateMethodBalance(authenticatedUser, methodInfo, amount);
        const transaction = await addRechargeTransaction(methodInfo, amount);

        return transaction; 
    } catch (error) {
        console.log("Erreur recharge:", error);
        throw error;
    }
}

export async function getActiveMethods(user)
{
    try{
        const authenticatedUser=await checkUser(user);
        const activeMethods=getUserActiveMethods(authenticatedUser);
        return activeMethods;
    }
    catch(error)
    {
        console.log("Erreur récupération des moyens actifs:", error);
        throw error;
    }
}
