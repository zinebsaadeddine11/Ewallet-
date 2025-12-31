import { rechargeAccount } from "../Services/RechargerServices";

const rechargeForm = document.getElementById("rechargeForm");
const amountInput = document.getElementById("amount");
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

rechargeForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showError("Veuillez entrer un montant valide");
        return;
    }
    if (amount > 50000) {
        showError("Le montant maximum par recharge est de 50 000 DH");
        return;
    }
    
    rechargeBtn.disabled = true;
    rechargeBtn.classList.add("loading");
    rechargeBtn.textContent = "Traitement en cours";

    return rechargeAccount(user,amount).then(()=>
    {
        rechargeBtn.classList.remove("loading");
        rechargeBtn.textContent = "✓ Recharge réussie !";
        rechargeBtn.style.background = "#2ecc71";
    }
    ).catch((error)=>console.log(error));
      
    });


retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});