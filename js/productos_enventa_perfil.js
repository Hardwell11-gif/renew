document.addEventListener('DOMContentLoaded', async function () {
  const listaProductos = document.querySelector('.lista_productos');
  const backendUrl = 'http://localhost:3000';

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.id) {
    alert("Por favor, inicia sesión.");
    window.location.href = "iniciar_sesion.html";
    return;
  }

  // Limpiar el contenedor
  listaProductos.innerHTML = '';

  try {
    const res = await fetch(`${backendUrl}/productos/vendedor/${currentUser.id}`);
    if (!res.ok) throw new Error('Error al cargar productos');
    const productosDelUsuario = await res.json();

    productosDelUsuario.forEach((producto, index) => {
      // Construir URL completa de la imagen si no la tiene
      let imagenSrc = producto.imagen || '';
      if (imagenSrc && !imagenSrc.startsWith('http://') && !imagenSrc.startsWith('https://')) {
        // Asumiendo que las imágenes están en /uploads/
        if (!imagenSrc.startsWith('/')) imagenSrc = '/uploads/' + imagenSrc;
        imagenSrc = backendUrl + imagenSrc;
      }

      productoDiv = document.createElement('div');
      productoDiv.classList.add('producto');

      productoDiv.innerHTML = `
        <a href="#">
          <div class="prenda">
            <img class="imageprenda" src="${imagenSrc}" alt="prenda">
          </div>
        </a>
        <div class="info_prenda">
          <a href="#">${producto.nombre || 'Sin nombre'}</a>
          <div class="precio_prenda">
            <p>S/ ${producto.precio !== undefined ? producto.precio : producto.precioFinal || '0'}</p>
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
        <button class="boton_eliminar" data-index="${index}">Eliminar</button>
        <button class="boton_vendido" data-index="${index}">Vendido</button>        
      `;

      listaProductos.appendChild(productoDiv);
    });

    // Eventos para botones específicos (Eliminar y Vendido)
    listaProductos.addEventListener('click', function (e) {
      if (e.target.classList.contains('boton_eliminar')) {
        const index = e.target.getAttribute('data-index');
        if (index !== null) {
          // Aquí puedes llamar a una función para eliminar el producto
          alert(`¿Estas seguro de eliminar este producto?`);
        }
      }
      if (e.target.classList.contains('boton_vendido')) {
        const index = e.target.getAttribute('data-index');
        if (index !== null) {
          // Aquí puedes llamar a una función para marcar como vendido
          alert(`Marcar como vendido producto con índice ${index}`);
        }
      }
    });

  } catch (error) {
    alert("Error al cargar productos.");
    console.error(error);
  }
});
