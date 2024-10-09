// Firebase initialization and database reference
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

// Your web app's Firebase configuration
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

document.getElementById("inputButton").addEventListener("click", async () => {
    var Nombre = document.getElementById("inputNombre").value;
    var Apellido = document.getElementById("inputApellido").value;
    var Telefono = document.getElementById("inputTelefono").value;

    if (Nombre === '' || Apellido === '' || Telefono === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        // Generate a unique ID for the new document
        const newUserRef = doc(db, "Users", Nombre + "_" + Apellido + "_" + new Date().getTime());

        await setDoc(newUserRef, {
            nombre: Nombre,
            apellido: Apellido,
            telefono: Telefono,
            createdAt: Timestamp.fromDate(new Date())
        });

        alert("Usuario creado exitosamente \n Bienvenido " + Nombre + " " + Apellido);

        // Limpiar los campos
        document.getElementById("inputNombre").value = "";
        document.getElementById("inputApellido").value = "";
        document.getElementById("inputTelefono").value = "";

    } catch (error) {
        console.error("Error al crear el usuario: ", error.message);
        alert("Error al crear el usuario");
    }
});

