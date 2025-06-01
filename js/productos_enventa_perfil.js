document.addEventListener('DOMContentLoaded', async function () {
  const listaProductos = document.querySelector('.lista_productos');
  const backendUrl = 'http://localhost:3000';

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.id) {
    await Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor, inicia sesión.',
      confirmButtonText: 'OK'
    });
    window.location.href = "iniciar_sesion.html";
    return;
  }

  async function cargarProductos() {
    listaProductos.innerHTML = '';

    try {
      const res = await fetch(`${backendUrl}/productos/vendedor/${currentUser.id}`);
      if (!res.ok) throw new Error('Error al cargar productos');
      const productosDelUsuario = await res.json();

      productosDelUsuario.forEach((producto, index) => {
        let imagenSrc = producto.imagen || '';
        if (imagenSrc && !imagenSrc.startsWith('http://') && !imagenSrc.startsWith('https://')) {
          if (!imagenSrc.startsWith('/')) imagenSrc = '/uploads/' + imagenSrc;
          imagenSrc = backendUrl + imagenSrc;
        }

        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.dataset.productoId = producto.id;

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

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar productos.',
        confirmButtonText: 'OK'
      });
      console.error(error);
    }
  }

  await cargarProductos();

  listaProductos.addEventListener('click', async function (e) {
    if (e.target.classList.contains('boton_eliminar')) {
      const productoDiv = e.target.closest('.producto');
      const productoId = productoDiv?.dataset.productoId;
      if (!productoId) return;

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres eliminar este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
      });

      if (!result.isConfirmed) return;

      try {
        const res = await fetch(`${backendUrl}/productos/${productoId}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al eliminar el producto');
        }

        await Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });

        await cargarProductos();

      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar producto: ' + error.message,
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
        console.error(error);
      }
    }

    if (e.target.classList.contains('boton_vendido')) {
      const index = e.target.getAttribute('data-index');
      if (index !== null) {
        await Swal.fire({
          icon: 'info',
          title: 'Función no implementada',
          text: `Marcar como vendido producto con índice ${index}`,
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
        // Aquí puedes agregar la lógica para marcar como vendido si tienes el endpoint
      }
    }
  });
});
