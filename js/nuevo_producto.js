document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formProducto');
  if (!formulario) {
    console.error("No se encontró el formulario con id 'formProducto'");
    return;
  }

  formulario.addEventListener('submit', async function (event) {
    event.preventDefault();
    const submitButton = formulario.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Guardando...';
    }

    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const genero = document.getElementById('genero').value;
    const precioOriginal = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];
    const imagenesSecundarias = document.getElementById('imagen_2').files;
    const errorImagenSecundaria = document.getElementById('imagen_2_error');

    if (!nombre || !categoria || !estado || !genero || !precioOriginal || !descripcion || !imagenFile) {
      alert("Por favor, completa todos los campos.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar';
      }
      return;
    }

    if (imagenesSecundarias.length !== 3) {
      errorImagenSecundaria.textContent = "Debes subir exactamente 3 imágenes secundarias.";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar';
      }
      return;
    } else {
      errorImagenSecundaria.textContent = "";
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert("No se encontró el usuario en sesión. Inicia sesión para publicar.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar';
      }
      return;
    }

    const precioFinal = (precioOriginal * 1.1).toFixed(2);

    try {
      const formData = new FormData();

      formData.append('nombre', nombre);
      formData.append('categoria', categoria);
      formData.append('estado', estado);
      formData.append('genero', genero);
      formData.append('precioFinal', precioFinal);
      formData.append('descripcion', descripcion);
      formData.append('vendedor_id', currentUser.id);
      formData.append('imagen', imagenFile);

      for (let i = 0; i < imagenesSecundarias.length; i++) {
        formData.append('imagenesSecundarias', imagenesSecundarias[i]);
      }

      const response = await fetch("http://localhost:3000/productos", {
        method: "POST",
        body: formData 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el producto.");
      }

      alert("Producto agregado exitosamente. Recuerda que tu producto se publicará con un precio del 10% más.");
      formulario.reset();
      window.location.href = 'productos.html';

    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al guardar el producto.");
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar';
    }
  });
});
