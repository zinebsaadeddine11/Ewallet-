import { findUser } from "../Model/Data.js";

const transferForm = document.getElementById("transferForm");
const amountInput = document.getElementById("amount");
const emailInput = document.getElementById("email");
const descriptionInput = document.getElementById("description");
const transferBtn = document.getElementById("transferBtn");
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

// Gérer le formulaire de transfert
transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    const email = emailInput.value.trim();
    const description = descriptionInput.value.trim() || "Transfert d'argent";
    
    // Validation
    if (!amount || amount <= 0) {
        showError("Veuillez entrer un montant valide");
        return;
    }
    
    if (!email) {
        showError("Veuillez entrer l'email du destinataire");
        return;
    }
    
    // Vérifier si l'utilisateur essaie de se transférer à lui-même
    if (email === user.email) {
        showError("Vous ne pouvez pas vous transférer de l'argent à vous-même !");
        return;
    }
    
    if (amount > user.balance) {
        showError("Solde insuffisant ! Votre solde : " + user.balance + " DH");
        return;
    }
    
    // Désactiver le bouton pendant le traitement
    transferBtn.disabled = true;
    transferBtn.classList.add("loading");
    transferBtn.textContent = "Traitement en cours";
    
    // Simuler le traitement du transfert
    setTimeout(() => {
        // Mettre à jour le solde
        user.balance -= amount;
        
        // Ajouter la transaction
        const newTransaction = {
            type: "-",
            title: "Transfert à " + email,
            date: new Date().toLocaleDateString('fr-FR'),
            amount: amount,
            status: "succeeded"
        };
        
        user.transactions.push(newTransaction);
        
        // Sauvegarder dans sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));
        
        // Afficher le succès
        transferBtn.classList.remove("loading");
        transferBtn.textContent = "✓ Transfert réussi !";
        transferBtn.style.background = "#2ecc71";
        
        // Rediriger vers le dashboard après 1.5 secondes
        setTimeout(() => {
            window.location.href = "/src/View/dashboard.html";
        }, 1500);
        
    }, 1500);
});

// Bouton retour
retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});