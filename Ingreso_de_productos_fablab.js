import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

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

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Inicialización de autenticación

// Función para guardar un producto
document.getElementById('btnGuardar').addEventListener('click', async () => {
    const codigo = document.getElementById('inputCodigo').value;
    const nombre = document.getElementById('inputNombre').value;
    const precio = document.getElementById('inputPrecio').value;
    const file = document.getElementById('inputFile').files[0];

    if (!codigo || !nombre || !precio || !file) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    try {
        const storageRef = ref(storage, 'productos/' + file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, 'productos'), {
            codigo,
            nombre,
            precio,
            imageUrl,
            createdAt: Timestamp.fromDate(new Date())
        });
        alert('Producto guardado con ID: ' + docRef.id);
        clearForm();
        loadProducts();
    } catch (e) {
        console.error('Error al guardar el producto: ', e);
        alert('Error al guardar el producto.');
    }
});

// Función para cargar productos
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const tableBody = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        const currencyFormatter = new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        });

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = data.codigo;
            row.insertCell(1).textContent = data.nombre;
            row.insertCell(2).textContent = currencyFormatter.format(data.precio);

            const imgCell = row.insertCell(3);
            const img = document.createElement('img');
            img.src = data.imageUrl || 'https://via.placeholder.com/100';
            img.style.width = '100px';
            img.style.height = 'auto';
            img.style.maxWidth = '150px';
            img.style.maxHeight = '100px';
            imgCell.appendChild(img);

            const actionsCell = row.insertCell(4);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteProduct(doc.id));
            actionsCell.appendChild(deleteButton);
        });
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, 'productos', id));
        alert('Producto eliminado.');
        loadProducts();
    } catch (e) {
        console.error('Error al eliminar el producto: ', e);
        alert('Error al eliminar el producto.');
    }
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputNombre').value = '';
    document.getElementById('inputPrecio').value = '';
    document.getElementById('inputFile').value = '';
}

// Función de cierre de sesión
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert("Has cerrado sesión correctamente.");
        window.location.href = 'loginAd.html'; // Redirige al usuario a la página de inicio de sesión
    } catch (e) {
        console.error('Error al cerrar sesión: ', e);
        alert("Error al cerrar sesión.");
    }
});

// Cargar productos al cargar la página
window.onload = loadProducts;
