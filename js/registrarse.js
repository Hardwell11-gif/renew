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
      if (!nombres || !apellidos || !direccion || !distrito || !dni || !email || !celular || !password || !valida_password) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Todos los campos son obligatorios.'
        });
        return;
      }

      const celularRegex = /^9\d{8}$/;
      if (!celularRegex.test(celular)) {
        Swal.fire({
          icon: 'error',
          title: 'Celular inválido',
          text: 'Debe tener 9 dígitos y empezar con 9.'
        });
        return;
      }

      if (password !== valida_password) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseñas no coinciden',
          text: 'Asegúrate de que ambas contraseñas sean iguales.'
        });
        return;
      }

      // Enviar datos al backend
      try {
        const res = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombres, apellidos, direccion, distrito, dni, email, celular, password })
        });

        const data = await res.json();

        if (!res.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: data.error || 'Ocurrió un error al registrar el usuario.'
          });
          return;
        }

        // Mensaje de éxito con redirección
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada. Ahora inicia sesión.',
          confirmButtonText: 'Ir a iniciar sesión'
        }).then(() => {
          window.location.href = "iniciar_sesion.html";
        });

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'No se pudo conectar con el servidor.'
        });
      }
    });
  }
});
