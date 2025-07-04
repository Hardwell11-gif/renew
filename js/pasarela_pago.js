document.addEventListener("DOMContentLoaded", () => {
  const numeroInput = document.getElementById("numero");
  const nombreInput = document.getElementById("nombre");
  const fechaInput = document.getElementById("fecha");
  const cvvInput = document.getElementById("cvv");
  const codigoYapeInput = document.getElementById("codigo_yape");
  const validarYapeBtn = document.getElementById("validar_yape");
  const botonPagar = document.getElementById("boton_pagar");

  // Botón de pagar con tarjeta
  botonPagar.addEventListener("click", async () => {
    const numeroSinEspacios = numeroInput.value.trim().replace(/\s+/g, "");
    const nombre = nombreInput.value.trim();
    const fecha = fechaInput.value.trim();
    const cvv = cvvInput.value.trim();

    if (!numeroSinEspacios || !nombre || !fecha || !cvv) {
      return Swal.fire("Campos incompletos", "Completa todos los campos de tarjeta.", "warning");
    }

    if (!/^\d{16}$/.test(numeroSinEspacios)) {
      return Swal.fire("Número de tarjeta inválido", "Debe tener exactamente 16 dígitos numéricos.", "error");
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      return Swal.fire("Nombre inválido", "Solo se permiten letras y espacios.", "error");
    }

    if (!/^\d{2}\/\d{2}$/.test(fecha)) {
      return Swal.fire("Fecha inválida", "Formato correcto: MM/AA", "error");
    }

    const [mes, anio] = fecha.split("/").map(Number);
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;

    if (mes < 1 || mes > 12) {
      return Swal.fire("Mes inválido", "El mes debe estar entre 01 y 12.", "error");
    }

    if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
      return Swal.fire("Tarjeta expirada", "Verifica la fecha de expiración.", "error");
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return Swal.fire("CVV inválido", "Debe tener 3 o 4 dígitos numéricos.", "error");
    }

    // Confirmación de pago por tarjeta
    Swal.fire({
      title: 'Pago con tarjeta exitoso',
      text: 'Gracias por tu compra. Te enviaremos un correo con los detalles.',
      icon: 'success',
      confirmButtonText: 'Continuar'
    }).then(async () => {
      await eliminarProducto();

      // Enviar mensaje a la pestaña que abrió esta ventana
      if (window.opener) {
        window.opener.postMessage("pago_completado", "*");
      }

      // Cerrar esta pestaña
      window.close();
    });
  });

  // Botón de validar código Yape
  validarYapeBtn.addEventListener("click", async () => {
    const codigo = codigoYapeInput.value.trim();

    if (!codigo) {
      return Swal.fire("Código requerido", "Ingresa un código para validar.", "warning");
    }

    if (!/^\d{3}$/.test(codigo)) {
      return Swal.fire("Código inválido", "El código de Yape debe tener exactamente 3 dígitos numéricos.", "error");
    }

    // Confirmación por Yape
    Swal.fire({
      title: 'Pago por Yape exitoso',
      text: 'Gracias por tu compra. Te enviaremos un correo con los detalles.',
      icon: 'success',
      confirmButtonText: 'Continuar'
    }).then(async () => {
      await eliminarProducto();

      // Enviar mensaje a la pestaña que abrió esta ventana
      if (window.opener) {
        window.opener.postMessage("pago_completado", "*");
      }

      // Cerrar esta pestaña
      window.close();
    });
  });

  // Función para eliminar producto
  async function eliminarProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");

    if (!productoId) {
      console.error("No se encontró el ID del producto para eliminar.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/productos/${productoId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el producto del backend.");
      }

    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire("Error", "No se pudo eliminar el producto del servidor.", "error");
    }
  }

  // Validaciones en tiempo real
  numeroInput.addEventListener("input", () => {
    const limpio = numeroInput.value.replace(/[^\d]/g, "").slice(0, 16);
    numeroInput.value = limpio.replace(/(.{4})/g, "$1 ").trim();
  });

  nombreInput.addEventListener("input", () => {
    nombreInput.value = nombreInput.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");
  });

  fechaInput.addEventListener("input", () => {
    let valor = fechaInput.value.replace(/[^\d]/g, "");
    if (valor.length >= 3) valor = valor.slice(0, 2) + "/" + valor.slice(2);
    fechaInput.value = valor.slice(0, 5);
  });

  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/[^\d]/g, "").slice(0, 4);
  });

  codigoYapeInput.addEventListener("input", () => {
    codigoYapeInput.value = codigoYapeInput.value.replace(/[^\d]/g, "").slice(0, 3);
  });
});
