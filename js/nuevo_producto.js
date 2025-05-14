const formulario = document.getElementById("formProducto");

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const genero = document.getElementById('genero').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];

    if (!nombre || !categoria || !estado || !genero || !precio || !descripcion || !imagenFile) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const base64Image = reader.result;

        const nuevoProducto = {
            nombre,
            categoria,
            estado,
            genero,
            precio,
            descripcion,
            imagen: base64Image, // ahora es una cadena base64
        };

        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));

        alert("Producto agregado exitosamente.");
        formulario.reset();
    };

    reader.readAsDataURL(imagenFile); // convierte la imagen a base64
});
