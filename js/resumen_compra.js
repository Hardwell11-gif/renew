document.addEventListener("DOMContentLoaded", function () {
    // 1. Obtener precio desde el div visual (del resumen del producto)
    const precioDivVisual = document.querySelector("#info_producto #precio_producto");
    let precioTexto = precioDivVisual?.textContent?.trim().replace(/[^\d.]/g, "");
    let precioProducto = parseFloat(precioTexto);

    if (isNaN(precioProducto)) {
        console.error("Precio no válido o no encontrado.");
        return;
    }

    // 2. Calcular envío y total
    const montoEnvio = +(precioProducto * 0.05).toFixed(2);
    const totalPagar = +(precioProducto + montoEnvio).toFixed(2);

    // 3. Rellenar los inputs y hacerlos readonly
    const resumenVenta = document.querySelector(".resumen_venta");

    const inputPrecio = resumenVenta.querySelector("input#precio_producto");
    const inputEnvio = resumenVenta.querySelector("input#monto_envio");
    const inputTotal = resumenVenta.querySelector("input#total_pagar");

    inputPrecio.value = precioProducto.toFixed(2);
    inputEnvio.value = montoEnvio.toFixed(2);
    inputTotal.value = totalPagar.toFixed(2);

    inputPrecio.readOnly = true;
    inputEnvio.readOnly = true;
    inputTotal.readOnly = true;

    // 4. Obtener currentUser con dirección y distrito
    const currentUserJSON = localStorage.getItem("currentUser");
    if (!currentUserJSON) {
        console.error("No se encontró el currentUser en localStorage.");
        return;
    }

    let currentUser;
    try {
        currentUser = JSON.parse(currentUserJSON);
    } catch (e) {
        console.error("Error al parsear currentUser:", e);
        return;
    }

    // 5. Rellenar dirección y distrito
    const direccionInput = resumenVenta.querySelector("input#direccion_comprador");
    const distritoSelect = resumenVenta.querySelector("select#distrito");

    if (currentUser.direccion) {
        direccionInput.value = currentUser.direccion;
    }

    if (currentUser.distrito) {
        distritoSelect.value = currentUser.distrito;
    }
});
