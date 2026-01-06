import { processPayment,validatePayment,checkUser,loadUserCards,loadData} from "../Services/payerServices.js";

const paymentForm = document.getElementById("paymentForm");
const amountInput = document.getElementById("amount");
const beneficiaryInput = document.getElementById("beneficiary");
const payBtn = document.getElementById("payBtn");
const RtrBtn = document.getElementById("RtrBtn");
const errorMessage = document.getElementById("errorMessage");
const cardSelect = document.getElementById("cardSelect");

const user = JSON.parse(sessionStorage.getItem("user"));
checkUser(user)
  .then((user) => loadUserCards(user,cardSelect))
  .catch((error) => {
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
    payBtn.classList.add("loading");
    payBtn.textContent = "Paiement en cours...";
    const amount = parseFloat(amountInput.value);
    const beneficiary = beneficiaryInput.value.trim();
    const cardId = cardSelect.value;
    if (!cardId || cardId === "") {
        showError("Veuillez sélectionner une carte");
        payBtn.classList.remove("loading");
        payBtn.textContent = "Payer";
        return;
    }
    const data = loadData();
    const selectedCard = data.cards.find(c => c.id === Number(cardId));
    if (!selectedCard) {
        showError("Carte sélectionnée introuvable");
        payBtn.classList.remove("loading");
        payBtn.textContent = "Payer";
        return;
    }
    validatePayment(amount, beneficiary, selectedCard)
        .then(processPayment)
        .then(handleSuccess)
        .catch((error) => {
            showError(error);
            payBtn.classList.remove("loading");
            payBtn.textContent = "Payer";
        });
});

RtrBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});