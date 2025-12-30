import { findUser } from "../Model/Data.js";

const paymentForm = document.getElementById("paymentForm");
const amountInput = document.getElementById("amount");
const beneficiaryInput = document.getElementById("beneficiary");
const payBtn = document.getElementById("payBtn");
const RtrBtn = document.getElementById("RtrBtn");
const errorMessage = document.getElementById("errorMessage");

const user = JSON.parse(sessionStorage.getItem("user"));

function checkUser(user) {
    return new Promise((resolve, reject) => {
        if(user)
        {
            resolve(user);
        }
        else
        {
             reject("Vous devez vous connecter d'abord !");
        }
    });
}

checkUser(user).catch(error => {
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
function validatePayment(amount, beneficiary, user) {
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0)
            reject("Veuillez entrer un montant valide");

        else if (!beneficiary)
            reject("Veuillez entrer le nom du bénéficiaire");

        else if (amount > user.balance)
            reject(`Solde insuffisant ! Votre solde : ${user.balance} DH`);

        else
            resolve({ amount, beneficiary });
    });
}


function processPayment({ amount, beneficiary }) {
    return new Promise(resolve => {
        payBtn.disabled = true;
        payBtn.classList.add("loading");
        payBtn.textContent = "Traitement en cours";

        setTimeout(() => {
            user.balance -= amount;

            user.transactions.push({
                type: "-",
                title: "Paiement à " + beneficiary,
                date: new Date().toLocaleDateString("fr-FR"),
                amount: amount,
                status: "succeeded"
            });

            sessionStorage.setItem("user", JSON.stringify(user));
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

    validatePayment(amount, beneficiary, user)
        .then(processPayment)
        .then(handleSuccess)
        .catch(showError);
});

RtrBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});
