document.addEventListener("DOMContentLoaded", () => {
  const loginform = document.getElementById("loginform");
  const errorElement = document.getElementById("error");

  loginform.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    errorElement.textContent = "";

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(user => user.email === email);

    if (!existingUser) {
      errorElement.textContent = "Correo no registrado.";
      return;
    }

    if (existingUser.password !== password) {
      errorElement.textContent = "Contraseña incorrecta.";
      return;
    }

    // Guardar al usuario activo
    localStorage.setItem("currentUser", JSON.stringify({
      id: existingUser.id,
      nombres: existingUser.nombres,
      apellidos: existingUser.apellidos,
      email: existingUser.email,
      direccion: existingUser.direccion,
      distrito: existingUser.distrito
    }));

    // Marcar como logueado
    localStorage.setItem("isLoggedIn", "true");

    // Obtener el parámetro 'redirect' de la URL
    const params = new URLSearchParams(window.location.search);
    const redirectURL = params.get('redirect');

    // Redirigir a la URL original si existe, si no, al index
    if (redirectURL) {
      window.location.href = decodeURIComponent(redirectURL);
    } else {
      window.location.href = "index.html";
    }
  });
});
