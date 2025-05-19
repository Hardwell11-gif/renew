// Validar si el usuario ha iniciado sesión
function validarSesion_vender() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verificamos si la sesión está activa

    if (isLoggedIn !== 'true') {  // Si no está logueado
        alert("Por favor, inicia sesión o registrate para poder vender productos.");
        window.location.href = "iniciar_sesion.html";  // Redirigir al login si no está logueado
    }
}

// Llamar la función al cargar la página de venta
document.addEventListener('DOMContentLoaded', () => {
    validarSesion_vender();
});


