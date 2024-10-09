import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

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

// Variable global para almacenar los productos cargados desde Firebase
let products = [];

// Función para cargar productos desde Firebase
async function loadProductsFromFirebase() {
    try {
        // Obtén los productos de Firebase
        const querySnapshot = await getDocs(collection(db, 'productos'));
        products = []; // Limpiar lista de productos

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id, // ID del documento
                name: data.nombre,
                price: data.precio,
                image: data.imageUrl || 'https://via.placeholder.com/150' // Imagen por defecto si no hay URL
            });
        });

        // Renderizar productos después de cargarlos desde Firebase
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar los productos de Firebase: ', e);
    }
}

// Función para renderizar los productos
function renderProducts(productsList) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Limpiar catálogo

    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Asegurarse de que el precio sea un número antes de usar toFixed
        const price = parseFloat(product.price); 
        const formattedPrice = isNaN(price) ? "Precio no disponible" : price.toFixed(2);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: Q${formattedPrice}</p>
            <button class="whatsappButton" data-product-name="${product.name}" data-product-price="${formattedPrice}" data-product-image="${product.image}">Me interesa</button>
        `;

        catalog.appendChild(productCard);
    });

    // Añadir el evento a todos los botones de WhatsApp
    const whatsappButtons = document.querySelectorAll('.whatsappButton');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productImage = this.getAttribute('data-product-image');
            const mensaje = `Hola, estoy interesado en el producto: ${productName}\nPrecio: Q${productPrice}\nImagen: ${productImage}`;
            const numeroTelefono = "+50259214176"; // Reemplaza con el número de teléfono deseado en formato internacional
            const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    });
}

// Función para filtrar productos
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchInput)
    );
    renderProducts(filteredProducts);
}

// Evento para la búsqueda
document.getElementById('searchInput').addEventListener('input', filterProducts);

// Inicializar catálogo cargando productos desde Firebase
loadProductsFromFirebase();
