import { processPayment, validatePayment, checkUser, loadUserPaymentMethods, loadData } from "../Services/payerServices.js";

const paymentForm = document.getElementById("paymentForm");
const amountInput = document.getElementById("amount");
const beneficiaryInput = document.getElementById("beneficiary");
const payBtn = document.getElementById("payBtn");
const RtrBtn = document.getElementById("RtrBtn");
const errorMessage = document.getElementById("errorMessage");
const moyenSelect = document.getElementById("moyenSelect");

const user = JSON.parse(sessionStorage.getItem("user"));

// Vérifier l'utilisateur et charger les moyens de paiement
async function checking(user) {
    try {
        const authenticatedUser = await checkUser(user);
        await loadUserPaymentMethods(authenticatedUser, moyenSelect);
    } catch (error) {
        console.log(error);
        alert(error);
        window.location.href = "/src/View/login.html";
    }
}

// Afficher un message d'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");

    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 4000);
}

// Gérer le succès du paiement
function handleSuccess() {
    payBtn.classList.remove("loading");
    payBtn.textContent = "✓ Paiement réussi !";
    payBtn.style.background = "#2ecc71";

    setTimeout(() => {
        window.location.href = "/src/View/dashboard.html";
    }, 1500);
}

// Gestionnaire de soumission du formulaire
paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    payBtn.classList.add("loading");
    payBtn.textContent = "Paiement en cours...";

    const amount = parseFloat(amountInput.value);
    const beneficiary = beneficiaryInput.value.trim();
    const methodValue = moyenSelect.value;

    if (!methodValue || methodValue === "") {
        showError("Veuillez sélectionner un moyen de paiement");
        payBtn.classList.remove("loading");
        payBtn.textContent = "Payer";
        return;
    }
    const [methodType, methodId] = methodValue.split("-");

    try {
       
        const validatedPayment = await validatePayment(amount, beneficiary, methodId, methodType);
    
        await processPayment(validatedPayment);

        handleSuccess();
    } catch (error) {
        showError(error);
        payBtn.classList.remove("loading");
        payBtn.textContent = "Payer";
    }
});


RtrBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});

checking(user);