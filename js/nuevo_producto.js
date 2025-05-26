const formulario = document.getElementById("formProducto");

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const genero = document.getElementById('genero').value;
    const precioOriginal = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];
    const imagenesSecundarias = document.getElementById('imagen_2').files;
    const errorImagenSecundaria = document.getElementById('imagen_2_error');

    // Validación de campos vacíos
    if (!nombre || !categoria || !estado || !genero || !precioOriginal || !descripcion || !imagenFile) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validar que haya exactamente 1 imágenes secundarias
    if (imagenesSecundarias.length !== 1) {
        errorImagenSecundaria.textContent = "Debes subir exactamente 1 imgen secundarias.";
        return;
    } else {
        errorImagenSecundaria.textContent = "";
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("No se encontró el usuario en sesión. Inicia sesión para publicar.");
        return;
    }

    const nombreVendedor = `${currentUser.nombres} ${currentUser.apellidos || ''}`.trim();
    const precioFinal = (precioOriginal * 1.1).toFixed(2);

    const reader = new FileReader();

    reader.onload = function () {
        const base64Image = reader.result;

        // Convertir imágenes secundarias a base64
        const imagenesSecundariasBase64 = [];

        if (imagenesSecundarias.length > 0) {
            let cargadas = 0;
            for (let i = 0; i < imagenesSecundarias.length; i++) {
                const fileReaderSec = new FileReader();
                fileReaderSec.onload = function (e) {
                    imagenesSecundariasBase64.push(e.target.result);
                    cargadas++;
                    if (cargadas === imagenesSecundarias.length) {
                        guardarProducto(base64Image, imagenesSecundariasBase64);
                    }
                };
                fileReaderSec.readAsDataURL(imagenesSecundarias[i]);
            }
        } else {
            guardarProducto(base64Image, []);
        }
    };

    reader.readAsDataURL(imagenFile); // Imagen principal a base64

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

        alert("Producto agregado exitosamente.");
        formulario.reset();
    }
});
