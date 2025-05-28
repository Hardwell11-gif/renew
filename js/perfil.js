document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const direccionInput = document.getElementById("direccion");
    const distritoInput = document.getElementById("distrito");
    const celularInput = document.getElementById("celular");
    const emailInput = document.getElementById("email");
    const formPerfil = document.getElementById("formPerfil");
    const formCambioPass = document.getElementById("formCambioPass");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!currentUser) {
        alert("Por favor, inicia sesión o registrate.");
        window.location.href = "iniciar_sesion.html";
        return;
    }

    const usuario = users.find(user => user.id === currentUser.id);
    if (!usuario) {
        alert("Usuario no encontrado.");
        return;
    }

    nombreInput.value = usuario.nombres + " " + usuario.apellidos;
    nombreInput.readOnly = true;
    direccionInput.value = usuario.direccion;
    distritoInput.value = usuario.distrito;
    celularInput.value = usuario.celular;
    emailInput.value = usuario.email;
    emailInput.readOnly = true;

    formPerfil.addEventListener("submit", (e) => {
        e.preventDefault();

        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("Debes iniciar seesión para actualizar tu perfil.");
            window.location.href = "index.html"
            return;
        }

        const celular = celularInput.value.trim();
        const celularRegex = /^9\d{8}$/;

        if (!celularRegex.test(celular)) {
            alert("Número de celular inválido. Debe tener 9 dígitos y comenzar con 9.");
            window.location.reload();
            return;
        }

        usuario.celular = celular;
        usuario.direccion = direccionInput.value;
        usuario.distrito = distritoInput.value;

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify({
            id: usuario.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            direccion: usuario.direccion,
            distrito: usuario.distrito
        }));

        alert("Datos actualizados correctamente.");
        window.location.href = "perfil.html";
    });

    formCambioPass.addEventListener("submit", (e) => {
        e.preventDefault();

        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para cambiar tu contraseña.");
            window.location.href = "index.html"            
            return;
        }

        const actual = document.getElementById("actual_password").value;
        const nueva = document.getElementById("nueva_password").value;
        const confirmacion = document.getElementById("confirmar_password").value;

        if (actual !== usuario.password) {
            alert("La contraseña actual es incorrecta.");
            return;
        }

        if (nueva !== confirmacion) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }

        usuario.password = nueva;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Contraseña actualizada correctamente.");
        formCambioPass.reset();
        window.location.href = "perfil.html";
    });
});
