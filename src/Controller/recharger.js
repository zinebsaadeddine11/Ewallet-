import { rechargeAccount, getActiveCards } from "../Services/RechargerServices.js";

const amountInput = document.getElementById("amount");
const cardIdInput = document.getElementById("cardId");
const rechargeBtn = document.getElementById("rechargeBtn");
const retourBtn = document.getElementById("retourBtn");
const errorMessage = document.getElementById("errorMessage");

const user = JSON.parse(sessionStorage.getItem("user"));

// Afficher un message d'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 4000);
}

getActiveCards(user)
    .then((activeCards) => {
        const cardIds = activeCards.map(c => `${c.id} (${c.type} ${c.lastFour})`).join(", ");
        cardIdInput.placeholder = `Ex: ${activeCards[0].id}`;
    })
    .catch((error) => {
        showError(error);
        rechargeBtn.disabled = true;
        cardIdInput.disabled = true;
        
        setTimeout(() => {
            window.location.href = "/src/View/login.html";
        }, 2000);
    });

function handleReload() {
    const amount = parseFloat(amountInput.value);
    const cardId = cardIdInput.value.trim();
    rechargeBtn.disabled = true;
    rechargeBtn.classList.add("loading");
    rechargeBtn.textContent = "Traitement en cours";
    amountInput.disabled = true;
    cardIdInput.disabled = true;

    rechargeAccount(user, amount, cardId)
        .then(() => {
            
            rechargeBtn.classList.remove("loading");
            rechargeBtn.textContent = "✓ Recharge réussie !";
            rechargeBtn.style.background = "#2ecc71";
            
            setTimeout(() => {
                window.location.href = "/src/View/dashboard.html";
            }, 1500);
        })
        .catch((error) => {
            
            rechargeBtn.classList.remove("loading");
            rechargeBtn.disabled = false;
            rechargeBtn.textContent = "Recharger";
            rechargeBtn.style.background = "";
            amountInput.disabled = false;
            cardIdInput.disabled = false;
            showError(error);
        });
}

rechargeBtn.addEventListener("click", handleReload);

retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});