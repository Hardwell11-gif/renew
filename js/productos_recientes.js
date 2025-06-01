document.addEventListener('DOMContentLoaded', async function () {
  const contenedor = document.querySelector('.productos');
  const backendUrl = 'http://localhost:3000';

  if (!contenedor) {
    console.error('No se encontró el contenedor .productos');
    return;
  }

  let productos = [];

  async function obtenerProductos() {
    try {
      const response = await fetch(`${backendUrl}/productos`);
      productos = await response.json();

      // Mostramos solo los 4 últimos productos
      const ultimosProductos = productos.slice(0,4);
      mostrarProductos(ultimosProductos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      contenedor.innerHTML = '<p style="text-align: center;">No se pudieron cargar los productos.</p>';
    }
  }

  function mostrarProductos(productos) {
    contenedor.innerHTML = '';

    productos.forEach((producto) => {
      const productoDiv = document.createElement('div');
      productoDiv.classList.add('producto');

      let imagenSrc = producto.imagen || '';

      if (
        imagenSrc &&
        !imagenSrc.startsWith('http://') &&
        !imagenSrc.startsWith('https://')
      ) {
        if (!imagenSrc.startsWith('/')) imagenSrc = '/uploads/' + imagenSrc;
        else if (!imagenSrc.startsWith('/uploads/')) imagenSrc = '/uploads' + imagenSrc;
        imagenSrc = backendUrl + imagenSrc;
      }

      let precio = producto.precioFinal ?? producto.precio ?? producto.price ?? 0;

      if (typeof precio === 'string') {
        precio = parseFloat(precio);
      }
      if (isNaN(precio)) {
        console.warn(`Precio inválido para producto ${producto.nombre}:`, producto.precioFinal);
        precio = 0;
      }
      const precioFormateado = precio.toFixed(2);

      productoDiv.innerHTML = `
        <div class="prenda">
          <img class="imageprenda" src="${imagenSrc}" alt="Imagen de ${producto.nombre || 'producto'}">
        </div>
        <div class="info_prenda">
          <h3>${producto.nombre || 'Sin nombre'}</h3>
          <div class="precio_prenda">
            <p>S/ ${precioFormateado}</p>
          </div>
          <div class="precio_prenda">
            <span>${producto.estado || 'N/A'}</span>
            <span>${producto.categoria || 'N/A'}</span>
            <span>${producto.genero || 'N/A'}</span>              
          </div>   
          <div class="vendedor">
            <span>${producto.vendedor || 'N/A'}</span>     
          </div>
        </div>
        <button class="boton_agregar" data-id="${producto.id}">
          Lo quiero!
        </button>
      `;

      contenedor.appendChild(productoDiv);
    });

    contenedor.addEventListener('click', function (e) {
      const boton = e.target.closest('.boton_agregar');
      if (boton) {
        const id = boton.getAttribute('data-id');
        window.location.href = 'detalles_producto.html?id=' + id;
      }
    });
  }

  await obtenerProductos();
});
