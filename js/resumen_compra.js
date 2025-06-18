document.addEventListener("DOMContentLoaded", async function () {
  const resumenVenta = document.querySelector(".resumen_venta");
  if (!resumenVenta) {
    console.error("No se encontró el contenedor resumen_venta");
    return;
  }

  // 1. Obtener el id del producto desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("id");

  if (!productoId) {
    console.error("No se encontró el id del producto en la URL");
    return;
  }

  const backendUrl = "http://localhost:3000";

  // 2. Obtener datos del producto desde backend
  let producto;
  try {
    const resProducto = await fetch(`${backendUrl}/productos/${productoId}`);
    if (!resProducto.ok) throw new Error("Producto no encontrado");
    producto = await resProducto.json();
  } catch (error) {
    console.error("Error al cargar datos del producto:", error);
    return;
  }

  // 3. Obtener precio del producto
  let precioProducto = parseFloat(producto.precioFinal ?? producto.precio ?? 0);
  if (isNaN(precioProducto)) precioProducto = 0;

  // 4. Calcular envío y total
  const montoEnvio = +(precioProducto * 0.05).toFixed(2);
  const totalPagar = +(precioProducto + montoEnvio).toFixed(2);

  // 5. Llenar inputs en resumen
  resumenVenta.querySelector("input#precio_producto").value = precioProducto.toFixed(2);
  resumenVenta.querySelector("input#monto_envio").value = montoEnvio.toFixed(2);
  resumenVenta.querySelector("input#total_pagar").value = totalPagar.toFixed(2);

  // Hacer readonly
  resumenVenta.querySelector("input#precio_producto").readOnly = true;
  resumenVenta.querySelector("input#monto_envio").readOnly = true;
  resumenVenta.querySelector("input#total_pagar").readOnly = true;

  // 6. Obtener currentUser desde localStorage
  const currentUserJSON = localStorage.getItem("currentUser");
  if (!currentUserJSON) {
    console.error("No se encontró currentUser en localStorage");
    return;
  }

  let currentUser;
  try {
    currentUser = JSON.parse(currentUserJSON);
  } catch (e) {
    console.error("Error al parsear currentUser:", e);
    return;
  }

  // 7. Hacer fetch para obtener datos actualizados del usuario
  try {
    const resUsuario = await fetch(`${backendUrl}/usuario/${currentUser.id}`);
    if (!resUsuario.ok) throw new Error("No se pudo obtener datos del usuario");
    const usuario = await resUsuario.json();

    // 8. Llenar dirección y distrito
    const direccionInput = resumenVenta.querySelector("input#direccion_comprador");
    const distritoSelect = resumenVenta.querySelector("select#distrito");

    if (direccionInput && usuario.direccion) direccionInput.value = usuario.direccion;
    if (distritoSelect && usuario.distrito) distritoSelect.value = usuario.distrito;
  } catch (error) {
    console.error("Error al obtener usuario de BD:", error);
  }

  document.getElementById("boton_pagar").addEventListener("click", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("id");

  if (!productoId) {
    console.error("No se encontró el id del producto para redirigir a la pasarela");
    return;
  }

  window.open(`pasarela_pago.html?id=${productoId}`, "_blank");
  //http://link.mercadopago.com.pe/renewperu

  window.addEventListener("message", function (event) {
    if (event.data === "pago_completado") {
      window.location.href = "productos.html";
    }
  });
  
});

});
