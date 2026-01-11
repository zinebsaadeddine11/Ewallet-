import {
    checkUser,
    loadUserMethods,
    validateAmount,
    checkReceiver,
    getReceiverMethod,
    processTransfer
} from "../Services/TransfererServices.js";

const transferForm = document.getElementById("transferForm");
const amountInput = document.getElementById("amount");
const emailInput = document.getElementById("email");
const descriptionInput = document.getElementById("description");
const methodsHolder = document.getElementById("methodsHolder");
const transferBtn = document.getElementById("transferBtn");
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

async function loadPaymentMethods() {
    try {
        await checkUser(user);
        const methods = await loadUserMethods(user);

        
        methods.forEach(method => {
            const option = document.createElement("option");
            option.value = `${method.type}-${method.id}`;
            option.textContent = method.display;
            methodsHolder.appendChild(option);
        });
    } catch (error) {
        showError(error);
        transferBtn.disabled = true;
        methodsHolder.disabled = true;

        setTimeout(() => {
            window.location.href = "/src/View/login.html";
        }, 2000);
    }
}


async function handleTransfer(e) {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const email = emailInput.value.trim();
    const description = descriptionInput.value.trim();
    const senderMethodValue = methodsHolder.value;

    if (!senderMethodValue || senderMethodValue === "Sélectionner un moyen de débit") {
        showError("Veuillez sélectionner un moyen de paiement");
        return;
    }

    if (!email) {
        showError("Veuillez entrer l'email du destinataire");
        return;
    }

    if (!amount || amount <= 0) {
        showError("Veuillez entrer un montant valide");
        return;
    }

  
    transferBtn.disabled = true;
    transferBtn.classList.add("loading");
    transferBtn.textContent = "Transfert en cours...";
    amountInput.disabled = true;
    emailInput.disabled = true;
    descriptionInput.disabled = true;
    methodsHolder.disabled = true;

    try {
       
        const sender = await checkUser(user);

        
        const { amount: validAmount, methodType, methodId } = await validateAmount(amount, senderMethodValue);

        
        const receiver = await checkReceiver(email, sender.email);

        
        const { method: receiverMethod, type: receiverType } = await getReceiverMethod(receiver);

       
        await processTransfer({
            sender,
            receiver,
            senderMethodId: methodId,
            senderMethodType: methodType,
            receiverMethodId: receiverMethod.id,
            receiverMethodType: receiverType,
            amount: validAmount,
            description
        });

        
        transferBtn.classList.remove("loading");
        transferBtn.textContent = "✓ Transfert réussi !";
        transferBtn.style.background = "#2ecc71";

        setTimeout(() => {
            window.location.href = "/src/View/dashboard.html";
        }, 1500);

    } catch (error) {
      
        transferBtn.classList.remove("loading");
        transferBtn.disabled = false;
        transferBtn.textContent = "Transférer";
        transferBtn.style.background = "";
        amountInput.disabled = false;
        emailInput.disabled = false;
        descriptionInput.disabled = false;
        methodsHolder.disabled = false;
        showError(error);
    }
}

transferForm.addEventListener("submit", handleTransfer);

retourBtn.addEventListener("click", () => {
    window.location.href = "/src/View/dashboard.html";
});

loadPaymentMethods();