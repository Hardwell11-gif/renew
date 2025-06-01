document.addEventListener("DOMContentLoaded", async () => {
  const nombreInput = document.getElementById("nombre");
  const direccionInput = document.getElementById("direccion");
  const distritoInput = document.getElementById("distrito");
  const celularInput = document.getElementById("celular");
  const emailInput = document.getElementById("email");
  const formPerfil = document.getElementById("formPerfil");
  const formCambioPass = document.getElementById("formCambioPass");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.id) {
    alert("Por favor, inicia sesión o regístrate.");
    window.location.href = "iniciar_sesion.html";
    return;
  }

  // Función para obtener datos usuario desde backend
  async function obtenerUsuario() {
    try {
      const res = await fetch(`http://localhost:3000/usuarios/${currentUser.id}`);
      if (!res.ok) throw new Error("Error al obtener datos");
      return await res.json();
    } catch (error) {
      alert("Error al cargar datos del usuario.");
      console.error(error);
      return null;
    }
  }

  // Cargar datos usuario
  const usuario = await obtenerUsuario();
  if (!usuario) return;

  nombreInput.value = usuario.nombres + " " + usuario.apellidos;
  nombreInput.readOnly = true;
  direccionInput.value = usuario.direccion;
  distritoInput.value = usuario.distrito;
  celularInput.value = usuario.celular;
  emailInput.value = usuario.email;
  emailInput.readOnly = true;

  formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para actualizar tu perfil.");
      window.location.href = "index.html";
      return;
    }

    const celular = celularInput.value.trim();
    const celularRegex = /^9\d{8}$/;

    if (!celularRegex.test(celular)) {
      alert("Número de celular inválido. Debe tener 9 dígitos y comenzar con 9.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direccion: direccionInput.value,
          distrito: distritoInput.value,
          celular: celular
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar datos");
      alert("Datos actualizados correctamente.");
      window.location.reload();

    } catch (error) {
      alert("Error al actualizar datos.");
      console.error(error);
    }
  });

  formCambioPass.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para cambiar tu contraseña.");
      window.location.href = "index.html";
      return;
    }

    const actual = document.getElementById("actual_password").value;
    const nueva = document.getElementById("nueva_password").value;
    const confirmacion = document.getElementById("confirmar_password").value;

    if (nueva !== confirmacion) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${currentUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual, nueva }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");

      alert("Contraseña actualizada correctamente.");
      formCambioPass.reset();
      window.location.reload();

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});
