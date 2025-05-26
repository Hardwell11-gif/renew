const formulario = document.getElementById("formProducto");

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = formulario.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true; // 🔒 Deshabilita el botón para evitar múltiples envíos
        submitButton.textContent = 'Guardando...'; // (opcional) cambia el texto
    }

    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const genero = document.getElementById('genero').value;
    const precioOriginal = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];
    const imagenesSecundarias = document.getElementById('imagen_2').files;
    const errorImagenSecundaria = document.getElementById('imagen_2_error');

    if (!nombre || !categoria || !estado || !genero || !precioOriginal || !descripcion || !imagenFile) {
        alert("Por favor, completa todos los campos.");
        if (submitButton) submitButton.disabled = false;
        return;
    }

    if (imagenesSecundarias.length !== 3) {
        errorImagenSecundaria.textContent = "Debes subir exactamente 3 imágenes secundaria.";
        if (submitButton) submitButton.disabled = false;
        return;
    } else {
        errorImagenSecundaria.textContent = "";
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("No se encontró el usuario en sesión. Inicia sesión para publicar.");
        if (submitButton) submitButton.disabled = false;
        return;
    }

    const nombreVendedor = `${currentUser.nombres} ${currentUser.apellidos || ''}`.trim();
    const precioFinal = (precioOriginal * 1.1).toFixed(2);

    convertirAWebP(imagenFile).then(base64Image => {
        const promesasSecundarias = Array.from(imagenesSecundarias).map(file => convertirAWebP(file));
        Promise.all(promesasSecundarias).then(imagenesSecundariasBase64 => {
            guardarProducto(base64Image, imagenesSecundariasBase64);
        }).catch(error => {
            alert("Error al procesar imágenes secundarias.");
            if (submitButton) submitButton.disabled = false;
        });
    }).catch(error => {
        alert("Error al procesar la imagen principal.");
        if (submitButton) submitButton.disabled = false;
    });

    function convertirAWebP(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
                    resolve(webpDataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function guardarProducto(imagenPrincipalBase64, imagenesSecBase64) {
        const nuevoProducto = {
            nombre,
            categoria,
            estado,
            genero,
            precioFinal,
            descripcion,
            imagen: imagenPrincipalBase64,
            imagenesSecundarias: imagenesSecBase64,
            vendedor: nombreVendedor
        };

        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));

        // Redirigir inmediatamente
        alert("Producto agregado exitosamente.");
        formulario.reset();
        window.location.href = 'productos.html';
    }
});
