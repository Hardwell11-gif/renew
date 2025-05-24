function validarSesion_vender() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        alert("Por favor, inicia sesión o registrate para poder vender productos.");
        const paginaActual = window.location.href;
        window.location.href = `iniciar_sesion.html?redirect=${encodeURIComponent(paginaActual)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    validarSesion_vender();
});


