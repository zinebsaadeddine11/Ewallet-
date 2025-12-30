import { findUser } from "../Model/Data.js";
const mailInput=document.getElementById("mail");
const passInput=document.getElementById("password");
const submitbtn=document.getElementById("submitbtn");
const result=document.getElementById("result");
submitbtn.addEventListener("click",handleSubmit);
function checkCredentials(mail, password, user) {
    return new Promise((resolve, reject) => {
        if (!mail || !password) {
            reject("Email ou mot de passe invalide");
        } 
        else if (!user) {
            reject("Utilisateur introuvable");
        } 
        else {
            resolve({ mail, password, user });
        }
    });
}

function processLogin({ user }) {
    return new Promise(resolve => {
        sessionStorage.setItem("user", JSON.stringify(user));

        result.textContent = "Succès";
        result.style.color = "green";

        setTimeout(() => {
            window.location.href = "/src/View/dashboard.html";
        }, 1000);

        resolve();
    });
}
function handleSubmit() {
    const mail = mailInput.value;
    const password = passInput.value;
    const user = findUser(mail, password);

    checkCredentials(mail, password, user)
        .then(processLogin)
        .catch(error => {
            result.textContent = error;
            result.style.color = "red";
        });
}
