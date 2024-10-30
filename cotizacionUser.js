// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Nueva configuración de Firebase
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
const db = getFirestore(app);
const auth = getAuth();

// Manejo del botón "Enviar"
document.getElementById("EnviarPedido").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener valores de los campos
    const nombre = document.getElementById("inputNombre").value.trim();
    const correo = document.getElementById("inputCorreo").value.trim();
    const contraseña = document.getElementById("inputContraseña").value;

    const messageDiv = document.getElementById("message"); // Div para mostrar mensajes
    messageDiv.innerText = ""; // Limpiar mensaje previo

    // Validación de campos
    if (!nombre || !correo || !contraseña) {
        messageDiv.innerText = "Todos los campos son obligatorios.";
        messageDiv.classList.add("text-danger");
        return;
    }

    try {
        // Crear un nuevo usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
        const user = userCredential.user;

        // Guardar información adicional en Firestore (sin contraseña)
        const newUserRef = doc(db, "Administracion", user.uid);
        await setDoc(newUserRef, {
            nombre: nombre,
            correo: correo,
            estado: true // Estado activo por defecto
        });

        messageDiv.innerText = `Bienvenido ${nombre}`;
        messageDiv.classList.remove("text-danger");
        messageDiv.classList.add("text-success");

        // Limpiar los campos del formulario
        document.getElementById("inputNombre").value = "";
        document.getElementById("inputCorreo").value = "";
        document.getElementById("inputContraseña").value = "";

        // Mostrar usuarios después de registrar uno nuevo
        mostrarUsuarios();

    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        let errorMessage = "Hubo un error al registrar el usuario.";
        if (error.code === "auth/invalid-email") {
            errorMessage = "El correo electrónico no es válido.";
        } else if (error.code === "auth/email-already-in-use") {
            errorMessage = "El correo electrónico ya está en uso.";
        }
        messageDiv.innerText = errorMessage;
        messageDiv.classList.add("text-danger");
    }
});



// Función para eliminar un usuario
async function eliminarUsuario(userId) {
    try {
        await deleteDoc(doc(db, "Administracion", userId)); // Reemplaza "Administracion" con el nombre de tu colección
        console.log("Usuario eliminado: ", userId);
        mostrarUsuarios(); // Refrescar la lista de usuarios
    } catch (error) {
        console.error("Error al eliminar el usuario: ", error);
    }
}

// Función para restablecer contraseña
async function restablecerContrasena(correo) {
    try {
        await sendPasswordResetEmail(auth, correo);
        alert("Se ha enviado un correo para restablecer la contraseña a " + correo);
    } catch (error) {
        console.error("Error al enviar el correo de restablecimiento: ", error);
    }
}

// Hacer las funciones accesibles globalmente
window.eliminarUsuario = eliminarUsuario;
window.restablecerContrasena = restablecerContrasena;

