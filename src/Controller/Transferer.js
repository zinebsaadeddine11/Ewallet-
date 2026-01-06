import {
  checkUser,
  validateAmount,
  checkReceiver,
  getActiveCard,
  processTransfer,loadCards,loadData
} from "../Services/TransfererServices.js";

const transferForm = document.getElementById("transferForm");
const amountInput = document.getElementById("amount");
const emailInput = document.getElementById("email");
const descriptionInput = document.getElementById("description");
const transferBtn = document.getElementById("transferBtn");
const retourBtn = document.getElementById("retourBtn");
const errorMessage = document.getElementById("errorMessage");
const currentUser = JSON.parse(sessionStorage.getItem("user"));
const cardHolder=document.getElementById("cardHolder");

checkUser(currentUser)
  .then(() => loadCards(currentUser, cardHolder))
  .catch(showError);
  
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.add("show");
  setTimeout(() => errorMessage.classList.remove("show"), 4000);
}

transferForm.addEventListener("submit", e => {
  e.preventDefault();
  const data=loadData();

  const amount = Number(amountInput.value);
  const email = emailInput.value.trim();
  const description = descriptionInput.value || "Transfert d'argent";

  let senderCard, receiver, receiverCard;

  checkUser(currentUser)
    .then(() => getActiveCard(currentUser.id))
    .then(card => {
      senderCard = card;
      return validateAmount(amount, senderCard);
    })
    .then(() => checkReceiver(email, currentUser.email))
    .then(r => {
      receiver = r;
      return getActiveCard(receiver.id);
    })
    .then(card => {
      receiverCard = card;
      transferBtn.disabled = true;
      transferBtn.classList.add("loading");
      return processTransfer({
        sender: currentUser,
        receiver,
        senderCard,
        receiverCard,
        amount,
        description
      });
    })
    .then(() => {
      transferBtn.classList.remove("loading");
      transferBtn.textContent = "✓ Transfert réussi";
      transferBtn.style.background = "#2ecc71";

      setTimeout(() => {
        window.location.href = "/src/View/dashboard.html";
      }, 1200);
    })
    .catch(showError);
});

retourBtn.addEventListener("click", () => {
  window.location.href = "/src/View/dashboard.html";
});
