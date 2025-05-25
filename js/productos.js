document.addEventListener('DOMContentLoaded', function () {
    const listaProductos = document.querySelector('.lista_productos');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroGenero = document.getElementById('filtro-genero');
    const botonFiltrar = document.querySelector('.aplicar_filtros');

    function mostrarProductos(productosFiltrados) {
        listaProductos.innerHTML = '';

        if (productosFiltrados.length === 0) {
            listaProductos.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        productosFiltrados.forEach((producto, index) => {
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
                    <div class="vendedor">
                        <span>${producto.vendedor}</span>     
                    </div>
                </div>
                <button class="boton_agregar" data-index="${productos.indexOf(producto)}">
                    Lo quiero!
                </button>
            `;

            listaProductos.appendChild(productoDiv);
        });
    }

    // Mostrar todos los productos al cargar
    mostrarProductos(productos);

    // Leer categoría desde localStorage si existe
    const categoriaGuardada = localStorage.getItem('categoriaFiltrada');
    if (categoriaGuardada) {
        filtroCategoria.value = categoriaGuardada;

        const productosFiltrados = productos.filter(producto =>
            producto.categoria === categoriaGuardada
        );

        if (productosFiltrados.length === 0) {
            alert('No se encontraron productos con la categoría que elegiste.');
            mostrarProductos(productos);
        }else{
            mostrarProductos(productosFiltrados);
        }
        // Limpia el filtro guardado para que no se aplique siempre
        localStorage.removeItem('categoriaFiltrada');
    } else {
        // Si no hay filtro guardado, muestra todos
        mostrarProductos(productos);
    }

    // Evento para aplicar filtros
    botonFiltrar.addEventListener('click', () => {
        const categoriaSeleccionada = filtroCategoria.value;
        const generoSeleccionado = filtroGenero.value;

        const productosFiltrados = productos.filter(producto => {
            const categoriaCoincide = categoriaSeleccionada === "" || producto.categoria === categoriaSeleccionada;
            const generoCoincide = generoSeleccionado === "" || producto.genero === generoSeleccionado;
            return categoriaCoincide && generoCoincide;
        });

        if (productosFiltrados.length === 0) {
            alert('No se encontraron productos con el filtro que elegiste.');
            mostrarProductos(productos);
        } else {
            mostrarProductos(productosFiltrados);
        }
    });

    // Evento de clic para "Lo quiero"
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

