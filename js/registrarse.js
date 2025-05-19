document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("RegisterForm");
  const errorElement = document.getElementById("error-msg");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombres = document.getElementById("nombres").value.trim();
      const apellidos = document.getElementById("apellidos").value.trim();
      const email = document.getElementById("email").value.trim();
      const celular = document.getElementById("celular").value.trim(); // NUEVO
      const password = document.getElementById("password").value.trim();
      const valida_password = document.getElementById("valida_password").value.trim();

      // Validaciones
      if (!nombres || !apellidos || !email || !celular || !password || !valida_password) {
        errorElement.textContent = "Todos los campos son obligatorios.";
        return;
      }

      // Validación del dominio del correo
      const emailRegex = /^[a-zA-Z0-9._%+-]+@alum\.udep\.edu\.pe$/;
      if (!emailRegex.test(email)) {
        errorElement.textContent = "Debes usar un correo institucional (@alum.udep.edu.pe).";
        return;
      }

      // Validación del celular peruano
      const celularRegex = /^9\d{8}$/;
      if (!celularRegex.test(celular)) {
        errorElement.textContent = "Número de celular inválido. Debe tener 9 dígitos y empezar con 9.";
        return;
      }

      if (password !== valida_password) {
        errorElement.textContent = "Las contraseñas no coinciden.";
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        errorElement.textContent = "Este correo electrónico ya está registrado.";
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        nombres,
        apellidos,
        email,
        celular, // NUEVO
        password,
        creadoEl: new Date().toString(),
        productos: [],
        productos_pendientes: [],
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      localStorage.setItem("currentUser", JSON.stringify({
        id: newUser.id,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        email: newUser.email,
      }));

      window.location.href = "iniciar_sesion.html";
    });
  }
});
