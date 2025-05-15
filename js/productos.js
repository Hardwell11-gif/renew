document.addEventListener('DOMContentLoaded', function () {
    const listaProductos = document.querySelector('.lista_productos');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Limpia el contenedor por si acaso
    listaProductos.innerHTML = '';

    productos.forEach((producto, index) => {
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
        <button class="boton_agregar" data-index="${index}">
            Lo quiero!
        </button>
    `;


        listaProductos.appendChild(productoDiv);
    });

    // Evento de clic para detectar cuál botón fue presionado
    listaProductos.addEventListener('click', function (e) {
        const boton = e.target.closest('.boton_agregar');
        if (boton) {
            const index = boton.getAttribute('data-index');
            if (index !== null) {
                const productoSeleccionado = productos[index];
                localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
                window.location.href = 'detalles_producto.html';
            }
        }
    });
});

