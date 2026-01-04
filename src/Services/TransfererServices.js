function checkUser(user) {
    return new Promise((resolve, reject) => {
        if (user) {
            resolve(user);
        } else {
            reject("Vous devez vous connecter d'abord !");
        }
    });
}
function validateAmount(amount, user) {
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0) {
            reject("Veuillez entrer un montant valide");
            return;
        }
        
        if (amount < 1) {
            reject("Le montant minimum pour un transfert est de 1 DH");
            return;
        }
        
        if (amount > user.account.balance) {
            reject(`Solde insuffisant ! Votre solde : ${user.account.balance} DH`);
            return;
        }
        
        resolve(amount);
    });
}
function validateEmail(email, userEmail) {
    return new Promise((resolve, reject) => {
        if (!email || email.trim() === "") {
            reject("Veuillez entrer l'email du destinataire");
            return;
        }
        
        if (email === userEmail) {
            reject("Vous ne pouvez pas vous transférer de l'argent à vous-même !");
            return;
        }
        
        resolve(email);
    });
}