const rechargeForm = document.getElementById("rechargeForm");
const amountInput = document.getElementById("amount");
const rechargeBtn = document.getElementById("rechargeBtn");
const retourBtn = document.getElementById("retourBtn");
const errorMessage = document.getElementById("errorMessage");

const user = JSON.parse(sessionStorage.getItem("user"));

// Vérifier si l'utilisateur est connecté
if (!user) {
    alert("Vous devez vous connecter d'abord !");
    window.location.href = "/src/View/login.html";
}

// Fonction pour afficher un message d'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 4000);
}

// Gérer le formulaire de recharge
rechargeForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    
    const amount = parseFloat(amountInput.value);
    
    // Validation
    if (!amount || amount <= 0) {
        showError("Veuillez entrer un montant valide");
        return;
    }
    
    if (amount > 50000) {
        showError("Le montant maximum par recharge est de 50 000 DH");
        return;
    }
    
    // Désactiver le bouton pendant le traitement
    rechargeBtn.disabled = true;
    rechargeBtn.classList.add("loading");
    rechargeBtn.textContent = "Traitement en cours";
    
    // Simuler le traitement de la recharge
    setTimeout(() => {
        // Mettre à jour le solde
        user.balance += amount;
        
        // Ajouter la transaction
        const newTransaction = {
            type: "+",
            title: "Recharge de compte",
            date: new Date().toLocaleDateString('fr-FR'),
            amount: amount,
            status: "succeeded"
        };
        
        user.transactions.push(newTransaction);
        
        // Sauvegarder dans sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));
        
        // Afficher le succès
        rechargeBtn.classList.remove("loading");
        rechargeBtn.textContent = "✓ Recharge réussie !";
        rechargeBtn.style.background = "#2ecc71";
        
        // Rediriger vers le dashboard après 1.5 secondes
        setTimeout(() => {
            window.location.href = "/src/View/dashboard.html";
        }, 1500);
        
    }, 1500); // Simuler 1.5 secondes de traitement
});

// Bouton retour
retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});