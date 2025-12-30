const users = [
  {
    name: "Ahmed",
    email: "amed12@gmail.com",
    password: "1234",
    balance: 12000,
     transactions: [
      { type: "-", title: "Bim", date: "12/11/2025", amount: 100, status: "succeeded" },
      { type: "-", title: "Restaurant", date: "12/12/2025", amount: 300, status: "succeeded" },
      { type: "-", title: "Market", date: "22/12/2025", amount: 600, status: "failed" },
      { type: "+", title: "Salaire", date: "01/12/2025", amount: 8000, status: "succeeded" },
      { type: "-", title: "Netflix", date: "05/12/2025", amount: 120, status: "succeeded" }
    ]
    },
    {
    name: "Ahlam",
    email: "ahlam34@gmail.com",
    password: "abcd",
    balance: 25600,
    transactions: [
      { type: "-", title: "Marjane", date: "23/11/2025", amount: 600, status: "succeeded" },
      { type: "+", title: "Virement reçu", date: "24/12/2025", amount: 250, status: "succeeded" },
      { type: "-", title: "Flormar", date: "22/12/2025", amount: 600, status: "failed" },
      { type: "-", title: "Zara", date: "18/12/2025", amount: 1200, status: "succeeded" }
    ]
    },

  {
    name: "Yassine",
    email: "yassine.dev@gmail.com",
    password: "pass123",
    balance: 8400,
    transactions: [
      { type: "+", title: "Freelance", date: "10/12/2025", amount: 5000, status: "succeeded" },
      { type: "-", title: "PC Gaming", date: "15/12/2025", amount: 4200, status: "succeeded" },
      { type: "-", title: "Spotify", date: "20/12/2025", amount: 80, status: "succeeded" }
    ]
  },

  {
    name: "Sara",
    email: "sara21@gmail.com",
    password: "sara2025",
    balance: 3100,
    transactions: [
      { type: "+", title: "Bourse", date: "01/11/2025", amount: 2000, status: "succeeded" },
      { type: "-", title: "Uber", date: "05/11/2025", amount: 90, status: "succeeded" },
      { type: "-", title: "Glovo", date: "08/11/2025", amount: 150, status: "succeeded" },
      { type: "-", title: "Pharmacie", date: "10/11/2025", amount: 60, status: "failed" }
    ]
  },

  {
    name: "Omar",
    email: "omar.pro@gmail.com",
    password: "omar@321",
    balance: 17800,
    transactions: [
      { type: "+", title: "Prime", date: "30/11/2025", amount: 3000, status: "succeeded" },
      { type: "-", title: "Voyage", date: "02/12/2025", amount: 5200, status: "succeeded" },
      { type: "-", title: "Hotel", date: "03/12/2025", amount: 3400, status: "succeeded" },
      { type: "-", title: "Taxi", date: "04/12/2025", amount: 120, status: "succeeded" }
    ]
  }
];

function findUser(email,password){
  let user=null;
  user=users.find((u)=>u.email===email&&u.password===password);
  return user;
}

function findTransaction(user, choix) {
  if (!user) return [];

  switch (choix) {
    case 1: // Entree
      return user.transactions.filter(t => t.type === "+");

    case 2: // Sortie
      return user.transactions.filter(t => t.type === "-");

    case 3: // Toutes
      return user.transactions;

    default:
      return [];
  }
}
export{findUser};
export{findTransaction};