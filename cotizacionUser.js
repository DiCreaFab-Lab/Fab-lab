import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

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

// Función para calcular la cotización
async function calcular() {
    const material = document.getElementById('Materiales').value;
    const ancho = parseFloat(document.getElementById('inputAncho').value);
    const largo = parseFloat(document.getElementById('inputLargo').value);
    const cantidad = parseInt(document.getElementById('inputCantidad').value);

    if (!material || isNaN(ancho) || isNaN(largo) || isNaN(cantidad)) {
        alert('Todos los campos son obligatorios y deben ser numéricos.');
        return;
    }

    const costosMateriales = {
        'MDF 3mm': 70 / (122 * 244),
        'MDF 6mm': 125 / (122 * 244),
        'Acrílico 3mm': 400 / (122 * 244),
        'Acrílico 6mm':700 /(122 * 244),
        'Acrílico negro': 475 / (122 * 244)
    };

    if (!costosMateriales[material]) {
        alert("Por favor selecciona un material válido.");
        return;
    }

    const area = ancho * largo;
    const costoUnitario = costosMateriales[material];
    const costo = (area * costoUnitario * cantidad).toFixed(2);
    const ganancia = (costo * 1.35).toFixed(2);

    // Muestra los resultados en la página
    document.getElementById('costo').innerText = 'Precio: Q.' + ganancia;
    document.getElementById('area').innerText = 'Área: ' + area + ' cm²';

    // conexion a firebase 
    document.getElementById("Datos").addEventListener("click", async () => {
        var nombre = document.getElementById("Nom").value;
        var numero = document.getElementById("Num").value;

        try {
            const docRef = await addDoc(collection(db, "cotizaciones"), {
                nombre: nombre,
                numero: numero,
                material: material,
                ancho: ancho,
                largo: largo,
                cantidad: cantidad,
                costo: costo,
                ganancia: ganancia,
                timestamp: Timestamp.now()
            });

                    alert("Cotizacion enviada")
            console.log("Documento escrito con ID: ", docRef.id);
            await enviarCorreo(nombre, numero, material, ancho, largo, cantidad, costo);
            mostrarHistorial();
        } catch (e) {
            console.error("Error al agregar el documento: ", e);
        }
    });
}

// Función para enviar el correo
async function enviarCorreo(fromName, fromNumber, material, ancho, largo, cantidad, costo) {
    const templateParams = {
        to_name: "Maria Guzmán",
        from_name: fromName,
        from_number: fromNumber,
        material: material,
        ancho: ancho,
        largo: largo,
        cantidad: cantidad,
        costo: costo
    };

    try {
        const response = await emailjs.send("service_6mgj61s", "template_hs5tvds", templateParams);
        console.log("Correo enviado con éxito: ", response);
    } catch (error) {
        console.error("Error al enviar el correo: ", error);
    }
};
document.getElementById('Calcular').addEventListener('click', calcular);

// Inicializar historial al cargar la página
mostrarHistorial();
