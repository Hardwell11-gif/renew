const formulario = document.getElementById("formProducto");

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const genero = document.getElementById('genero').value;
    const precioOriginal = parseFloat(document.getElementById('precio').value);
    const precioFinal = (precioOriginal * 1.1).toFixed(2);
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];

    if (!nombre || !categoria || !estado || !genero || !precio || !descripcion || !imagenFile) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("No se encontró el usuario en sesión. Inicia sesión para publicar.");
        return;
    }

    const nombreVendedor = `${currentUser.nombres} ${currentUser.apellidos || ''}`.trim();

    const reader = new FileReader();

    reader.onload = function () {
        const base64Image = reader.result;

        const nuevoProducto = {
            nombre,
            categoria,
            estado,
            genero,
            precioFinal,
            descripcion,
            imagen: base64Image, // Imagen en base64
            vendedor: nombreVendedor // Nombre completo del vendedor
        };

        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));

        alert("Producto agregado exitosamente.");
        formulario.reset();
    };

    reader.readAsDataURL(imagenFile); // Convierte la imagen a base64
});
