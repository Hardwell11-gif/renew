document.addEventListener('DOMContentLoaded', function () {
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (!producto) {
        console.error('No se encontró el producto seleccionado en localStorage.');
        return;
    }

    document.getElementById('imagen_producto').src = producto.imagen || '';
    document.getElementById('imagen_producto').alt = `Imagen de ${producto.nombre || 'producto'}`;

    document.getElementById('nombre_producto').textContent = producto.nombre || 'Sin nombre';
    document.getElementById('precio_producto').textContent = 'S/ '+`${producto.precioFinal || '0'}`;

    document.getElementById('categoria_producto').textContent = producto.categoria || 'N/A';
    document.getElementById('estado_producto').textContent = producto.estado || 'N/A';
    document.getElementById('genero_producto').textContent = producto.genero || 'N/A';
    document.getElementById('nombre_vendedor').textContent = producto.vendedor || 'N/A';

    document.getElementById('descripcion_producto').textContent = producto.descripcion || 'Sin descripción.';

    // Mostrar imágenes secundarias
    const contenedorSecundarias = document.getElementById('imagenes_secundarias');
    if (contenedorSecundarias && Array.isArray(producto.imagenesSecundarias)) {
        producto.imagenesSecundarias.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Imagen secundaria ${index + 1} de ${producto.nombre}`;
            img.classList.add('imagen-secundaria'); // Añade clase por si quieres estilizar
            contenedorSecundarias.appendChild(img);
        });
    }

    const botonComprar = document.getElementById('boton_comprar');
    botonComprar.addEventListener('click', () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (isLoggedIn !== 'true') {
            alert('Por favor inicia sesión para continuar con la compra.');
            const paginaActual = window.location.href;
            window.location.href = `iniciar_sesion.html?redirect=${encodeURIComponent(paginaActual)}`;            
            return;
        }

        if (!currentUser || !currentUser.nombres || !currentUser.apellidos) {
            alert('No se encontró el usuario en sesión. Inicia sesión para continuar.');
            const paginaActual = window.location.href;
            window.location.href = `iniciar_sesion.html?redirect=${encodeURIComponent(paginaActual)}`;            
            return;
        }

        const nombreCurrentUser = (currentUser.nombres + ' ' + currentUser.apellidos).trim().toLowerCase();
        const nombreVendedor = (producto.vendedor || '').trim().toLowerCase();

        if (nombreCurrentUser === nombreVendedor) {
            alert("Este producto lo vendes tú");
            window.location.href = 'perfil.html#vendo';
        } else {
            window.location.href = 'resumen_compra.html';
        }
    });
});
