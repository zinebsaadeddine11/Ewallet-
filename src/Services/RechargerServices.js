function checkUser(user) {
    return new Promise((resolve, reject) => {
        if(user)
        {
            resolve(user);
        }
        else
        {
             reject("Vous devez vous connecter d'abord !");
        }
    });
}
function updateSolde(user,amount)
{
    return new Promise((resolve,reject)=>
    {
        if(amount>0)
        {
            user.balance += amount;
            resolve("Reload done")
        }
        else
        {
            reject("Amount invalid");
        }
    });
}
function addNewTrasaction(user,amount)
{
    return new Promise((resolve)=>
    {
        let charge= {
            type: "+",
            title: "Recharge de compte",
            date: new Date().toLocaleDateString(),
            amount: amount,
            status: "succeeded"
        };
         user.transactions.push(charge);
        
        sessionStorage.setItem("user", JSON.stringify(user));

        resolve("Trasaction added");
    });
}
export function rechargeAccount(user,amount)
{
    return checkUser(user).then((user)=>
    {
        return updateSolde(user,amount);
    })
    .then(()=>
    {
        return addNewTrasaction(user,amount);
    })
    .catch((error)=>{console.log(error)});
}