import { rechargeAccount, getActiveMethods } from "../Services/RechargerServices.js";

const amountInput = document.getElementById("amount");
const methodSelect = document.getElementById("DestSelect");
const rechargeBtn = document.getElementById("rechargeBtn");
const retourBtn = document.getElementById("retourBtn");
const errorMessage = document.getElementById("errorMessage");

const user = JSON.parse(sessionStorage.getItem("user"));

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 4000);
}

getActiveMethods(user)
    .then((activeMethods) => {
        activeMethods.forEach(method => {
            const option = document.createElement("option");
            option.value = `${method.type}-${method.id}`;
            option.textContent = method.display;
            DestSelect.appendChild(option);
        });
    })
    .catch((error) => {
        showError(error);
        rechargeBtn.disabled = true;
        methodSelect.disabled = true;
        
        setTimeout(() => {
            window.location.href = "/src/View/login.html";
        }, 2000);
    });

async function handleReload() {
    const amount = parseFloat(amountInput.value);
    const methodValue = methodSelect.value;

    if (!methodValue || methodValue === "") {
        showError("Veuillez sélectionner un moyen de paiement");
        return;
    }

    if (!amount || amount <= 0) {
        showError("Veuillez entrer un montant valide");
        return;
    }
    rechargeBtn.disabled = true;
    rechargeBtn.classList.add("loading");
    rechargeBtn.textContent = "Traitement en cours...";
    amountInput.disabled = true;
    methodSelect.disabled = true;

    try {
        await rechargeAccount(user, amount, methodValue);
        
        
        rechargeBtn.classList.remove("loading");
        rechargeBtn.textContent = "✓ Recharge réussie !";
        rechargeBtn.style.background = "#2ecc71";
        
        setTimeout(() => {
            window.location.href = "/src/View/dashboard.html";
        }, 1500);
    } catch (error) {
        
        rechargeBtn.classList.remove("loading");
        rechargeBtn.disabled = false;
        rechargeBtn.textContent = "Recharger";
        rechargeBtn.style.background = "";
        amountInput.disabled = false;
        methodSelect.disabled = false;
        showError(error);
    }
}

rechargeBtn.addEventListener("click", handleReload);

retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});