document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("RegisterForm");
  const errorElement = document.getElementById("error-msg");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nombres = document.getElementById("nombres").value.trim();
      const apellidos = document.getElementById("apellidos").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const distrito = document.getElementById("distrito").value.trim();
      const dni = document.getElementById("dni").value.trim();
      const email = document.getElementById("email").value.trim();
      const celular = document.getElementById("celular").value.trim();
      const password = document.getElementById("password").value.trim();
      const valida_password = document.getElementById("valida_password").value.trim();

      // Validaciones
      if (!nombres || !apellidos  || !direccion || !distrito || !dni || !email || !celular || !password || !valida_password) {
        errorElement.textContent = "Todos los campos son obligatorios.";
        return;
      }

      const celularRegex = /^9\d{8}$/;
      if (!celularRegex.test(celular)) {
        errorElement.textContent = "Número de celular inválido. Debe tener 9 dígitos y empezar con 9.";
        return;
      }

      if (password !== valida_password) {
        errorElement.textContent = "Las contraseñas no coinciden.";
        return;
      }

      // Enviar datos al backend
      try {
        const res = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ nombres, apellidos, direccion, distrito, dni, email, celular, password })
        });

        const data = await res.json();

        if (!res.ok) {
          errorElement.textContent = data.error || 'Error en el registro';
          return;
        }

        // Guardar usuario actual en localStorage para la sesión, si quieres
        localStorage.setItem("currentUser", JSON.stringify({
          id: data.id,
          nombres,
          apellidos,
          email
        }));

        alert("Usuario Registrado. Por favor, inicia sesión.")
        window.location.href = "iniciar_sesion.html";

      } catch (error) {
        errorElement.textContent = "Error al conectar con el servidor.";
        console.error(error);
      }
    });
  }
});
