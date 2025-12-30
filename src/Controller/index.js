const Loginbtn=document.getElementById("Loginbtn");

Loginbtn.addEventListener("click",handleSign);

 function handleSign(){
    Loginbtn.textContent="Loading...";
    setTimeout(()=>{
        window.location.href="/src/View/login.html"
    },1000);
 }