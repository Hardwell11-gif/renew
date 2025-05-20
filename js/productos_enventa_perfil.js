document.addEventListener('DOMContentLoaded', function () {
    const listaProductos = document.querySelector('.lista_productos');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener el usuario actual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!currentUser) {
        alert("Por favor, inicia sesión.");
        window.location.href = "iniciar_sesion.html";
        return;
    }

    const usuario = users.find(user => user.id === currentUser.id);
    if (!usuario) {
        alert("Usuario no encontrado.");
        return;
    }

    const nombreCompleto = usuario.nombres + " " + usuario.apellidos;

    // Limpia el contenedor por si acaso
    listaProductos.innerHTML = '';

    // Filtrar productos por vendedor (el usuario actual)
    const productosDelUsuario = productos.filter(producto => producto.vendedor === nombreCompleto);

    productosDelUsuario.forEach((producto, index) => {
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
                    ${producto.nombre}
                </a>
                <div class="precio_prenda">
                    <p>${producto.precio} PEN</p>
                </div>
                <div class="precio_prenda">
                    <span>${producto.estado}</span>
                    <span>${producto.categoria}</span>
                    <span>${producto.genero}</span>              
                </div>   
                <div class="vendedor">
                    <span>${producto.vendedor}</span>     
                </div>
            </div>
            <button class="boton_agregar" data-index="${index}">
                eliminar
            </button>
            <button class="boton_agregar" data-index="${index}">
                vendido 
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
                const productoSeleccionado = productosDelUsuario[index];
                localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
                window.location.href = 'detalles_producto.html';
            }
        }
    });
});
