import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDnKcHS41_TH5jzmT2gIEU6-h4C_dnIML8",
    authDomain: "fablab2-88ab1.firebaseapp.com",
    projectId: "fablab2-88ab1",
    storageBucket: "fablab2-88ab1.appspot.com",
    messagingSenderId: "30169496903",
    appId: "1:30169496903:web:a7060677c0513fe1ea6062",
    measurementId: "G-TL1F53C259"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const quoteTableBody = document.getElementById('quoteTableBody');


async function loadQuotes() {
    const querySnapshot = await getDocs(collection(db, "cotizaciones"));
    quoteTableBody.innerHTML = ''; 

    querySnapshot.forEach((doc) => {
        const quote = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.material}</td>
            <td>${quote.ancho}</td>
            <td>${quote.largo}</td>
            <td>${quote.cantidad}</td>
            <td>Q. ${quote.costo}</td>
            <td>Q. ${quote.ganancia}</td>
            <td>${quote.timestamp.toDate().toLocaleDateString()}</td>
        `;
        quoteTableBody.appendChild(row);
    });
}

// Cargamos las cotizaciones cuando se carga la página
loadQuotes();
