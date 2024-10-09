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
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const nombre = document.getElementById("inputNombre").value.trim();
    const correo = document.getElementById("inputCorreo").value.trim();
    const contraseña = document.getElementById("inputContraseña").value;

    const messageDiv = document.getElementById("message"); // Div para mostrar mensajes

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
        contraseña: contraseña, // Guardar la contraseña en Firestore (texto plano)
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

// Mostrar usuarios
async function mostrarUsuarios() {
    const querySnapshot = await getDocs(collection(db, "Administracion"));
    const usuariosElement = document.getElementById("usuariosTable").getElementsByTagName('tbody')[0];
    usuariosElement.innerHTML = ""; // Limpiar la tabla antes de llenarla

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.nombre}</td>
            <td>${data.correo}</td>
            <td>${data.contraseña}</td>
            <td>${data.estado ? 'Activo' : 'Desactivado'}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarUsuario('${doc.id}')">Eliminar</button>
                <button class="btn btn-secondary" onclick="restablecerContrasena('${data.correo}')">Restablecer Contraseña</button>
            </td>
        `;
        usuariosElement.appendChild(row);
    });
}

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

// Inicializar la lista de usuarios al cargar la página
mostrarUsuarios();
