// Cargar los productos desde el localStorage y mostrarlos en el HTML
document.addEventListener('DOMContentLoaded', function() {
    const listaProductos = document.querySelector('.lista_productos');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    productos.forEach(producto => {
        // Crear el HTML para cada producto
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        productoDiv.innerHTML = `
            <a href="#">
                <div class="prenda">
                    <img class="imageprenda" src="${producto.imagen}" alt="prenda">
                </div>
            </a>
            <div class="info_prenda">
                <a href="#">
                    <h3>${producto.nombre}</h3>
                </a>
                <div class="precio_prenda">
                    <p>${producto.precio} PEN</p>
                </div>
                <div class="precio_prenda">
                    <span>${producto.estado}</span>
                    <span>${producto.categoria}</span>
                    <span>${producto.genero}</span>
                </div>
            </div>
            <div class="boton_prenda">
                <button class="boton_agregar">
                    <a class="text_boton_agregar" href="#">Lo quiero!</a>
                </button>
            </div>
        `;

        // Agregar el nuevo producto al contenedor de productos
        listaProductos.appendChild(productoDiv);
    });
});

