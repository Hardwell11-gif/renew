document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const formPerfil = document.getElementById("formPerfil");
    const formCambioPass = document.getElementById("formCambioPass");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!currentUser) {
        alert("No hay usuario logueado.");
        window.location.href = "iniciar_sesion.html";
        return;
    }

    const usuario = users.find(user => user.id === currentUser.id);
    if (!usuario) {
        alert("Usuario no encontrado.");
        return;
    }

    nombreInput.value = usuario.nombres;
    emailInput.value = usuario.email;
    emailInput.readOnly = true;

    formPerfil.addEventListener("submit", (e) => {
        e.preventDefault();
        usuario.nombres = nombreInput.value;
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify({
            id: usuario.id,
            nombres: usuario.nombres,
            email: usuario.email
        }));

        alert("Nombre actualizado correctamente.");
    });

    formCambioPass.addEventListener("submit", (e) => {
        e.preventDefault();

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
    });
});
