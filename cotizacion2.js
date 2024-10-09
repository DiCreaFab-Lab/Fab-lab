document.addEventListener('DOMContentLoaded', function() {
    const nombreCompleto = document.getElementById('nombreCompleto');
    const telefono = document.getElementById('telefono');
    const correo = document.getElementById('correo');
    const materiales = document.getElementById('Materiales');
    const tipoCorteInterno = document.getElementById('CorteInterno');
    const tipoCorteExterno = document.getElementById('CorteExterno');
    const escaneado = document.getElementById('Escaneado');
    const marcado = document.getElementById('Marcado');
    const imageUpload = document.getElementById('imageUpload');
    const uploadedImage = document.getElementById('uploadedImage');
    const enviarPedido = document.getElementById('enviarPedido');
    
    let imageURL = '';

    // Al cargar la imagen, mostrarla y prepararla para el enlace
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
                // Suponiendo que luego subes la imagen a un servidor, aquí iría el código para obtener la URL
                imageURL = e.target.result;  // En este caso, solo simulamos que es la URL de la imagen
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage.src = '';
            uploadedImage.style.display = 'none';
            imageURL = '';
        }
    });

    enviarPedido.addEventListener('click', function() {
        const selectedMaterial = materiales.value;
        const tiposDeCorte = [];

        if (tipoCorteInterno.checked) tiposDeCorte.push(tipoCorteInterno.value);
        if (tipoCorteExterno.checked) tiposDeCorte.push(tipoCorteExterno.value);
        if (escaneado.checked) tiposDeCorte.push(escaneado.value);
        if (marcado.checked) tiposDeCorte.push(marcado.value);

        // Mensaje a enviar por WhatsApp
        const mensaje = `Hola, me gustaría realizar un pedido:\n\nNombre completo: ${nombreCompleto.value}\nTeléfono: ${telefono.value}\nCorreo: ${correo.value}\nMaterial: ${selectedMaterial}\nTipos de corte: ${tiposDeCorte.join(', ')}\n\nImagen del producto: ${imageURL || 'No se cargó ninguna imagen.'}`;
        const numeroTelefono = "+40790247";  // Cambia este número por el número de WhatsApp al que quieres enviar
        const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

        // Intentar abrir WhatsApp
        try {
            window.open(url, '_blank');
            alert('Pedido enviado correctamente.');
        } catch (error) {
            alert('Hubo un error al enviar el pedido.');
        }
    });
});
