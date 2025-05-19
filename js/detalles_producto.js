document.addEventListener('DOMContentLoaded', function () {
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (!producto) {
        console.error('No se encontró el producto seleccionado en localStorage.');
        return;
    }

    // Asignar los valores a los elementos por ID
    document.getElementById('imagen_producto').src = producto.imagen || '';
    document.getElementById('imagen_producto').alt = `Imagen de ${producto.nombre || 'producto'}`;

    document.getElementById('nombre_producto').textContent = producto.nombre || 'Sin nombre';
    document.getElementById('precio_producto').textContent = `${producto.precio || '0'} PEN`;

    document.getElementById('categoria_producto').textContent = producto.categoria || 'N/A';
    document.getElementById('estado_producto').textContent = producto.estado || 'N/A';
    document.getElementById('genero_producto').textContent = producto.genero || 'N/A';
    document.getElementById('nombre_vendedor').textContent = producto.vendedor || 'N/A';

    document.getElementById('descripcion_producto').textContent = producto.descripcion || 'Sin descripción.';
});

