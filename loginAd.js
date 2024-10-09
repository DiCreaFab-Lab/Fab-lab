import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnKcHS41_TH5jzmT2gIEU6-h4C_dnIML8",
    authDomain: "fablab2-88ab1.firebaseapp.com",
    projectId: "fablab2-88ab1",
    storageBucket: "fablab2-88ab1.appspot.com",
    messagingSenderId: "30169496903",
    appId: "1:30169496903:web:a7060677c0513fe1ea6062",
    measurementId: "G-TL1F53C259"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Funcionalidad del botón "Ingresar"
document.getElementById("Ingresar").addEventListener("click", async () => {
    var email = document.getElementById("gmail").value;
    var password = document.getElementById("password").value;

    // Validación de campos
    if (email === '' || password === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        // Iniciar sesión con Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("Inicio de sesión exitoso");

        // Redirigir a la página deseada después del inicio de sesión
        window.location.href = "ingresar_Producto.html";
    } catch (error) {
        console.log("Error al iniciar sesión: ", error);
        alert("Correo electrónico o contraseña incorrectos.");
    }

    // Limpiar los campos del formulario
    document.getElementById("gmail").value = "";
    document.getElementById("password").value = "";
});