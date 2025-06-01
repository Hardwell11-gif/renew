document.addEventListener('DOMContentLoaded', function () {
  // Obtener el id del producto desde la URL (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get('id');

  if (!productoId) {
    console.error('No se encontró el ID del producto.');
    return;
  }

  const backendUrl = 'http://localhost:3000';

  // Fetch para obtener los datos del producto según su ID
  fetch(`${backendUrl}/productos/${productoId}`)
    .then(res => {
      if (!res.ok) throw new Error('Producto no encontrado');
      return res.json();
    })
    .then(producto => {
      // Imagen principal con ruta completa
      let imagenPrincipal = producto.imagen || '';
      if (imagenPrincipal && !imagenPrincipal.startsWith('http')) {
        imagenPrincipal = `${backendUrl}/uploads/${imagenPrincipal}`;
      }
      const imgProducto = document.getElementById('imagen_producto');
      imgProducto.src = imagenPrincipal;
      imgProducto.alt = `Imagen de ${producto.nombre || 'producto'}`;

      // Mostrar datos básicos
      document.getElementById('nombre_producto').textContent = producto.nombre || 'Sin nombre';
      document.getElementById('precio_producto').textContent = 'S/ ' + (producto.precio || '0');
      document.getElementById('categoria_producto').textContent = producto.categoria || 'N/A';
      document.getElementById('estado_producto').textContent = producto.estado || 'N/A';
      document.getElementById('genero_producto').textContent = producto.genero || 'N/A';
      document.getElementById('nombre_vendedor').textContent = producto.vendedor || 'N/A';
      document.getElementById('descripcion_producto').textContent = producto.descripcion || 'Sin descripción.';

      // Cargar imágenes secundarias
      const contenedorSecundarias = document.getElementById('imagenes_secundarias');
      if (contenedorSecundarias && Array.isArray(producto.imagenes_secundarias)) {
        contenedorSecundarias.innerHTML = ''; // Limpiar contenido previo
        producto.imagenes_secundarias.forEach((imgSrc, index) => {
          let urlImgSec = imgSrc;
          if (urlImgSec && !urlImgSec.startsWith('http')) {
            urlImgSec = `${backendUrl}/uploads/${urlImgSec}`;
          }
          const img = document.createElement('img');
          img.src = urlImgSec;
          img.alt = `Imagen secundaria ${index + 1} de ${producto.nombre}`;
          img.classList.add('imagen-secundaria');
          contenedorSecundarias.appendChild(img);
        });
      }

      // Configurar botón comprar
      const botonComprar = document.getElementById('boton_comprar');
      if (botonComprar) {
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
            window.location.href = 'resumen_compra.html?id='+productoId;
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error al cargar el producto.');
    });
});
