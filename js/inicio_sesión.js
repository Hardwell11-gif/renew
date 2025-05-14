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
      email: existingUser.email
    }));

    // Marcar como logueado
    localStorage.setItem("isLoggedIn", "true");

    // Redirigir
    window.location.href = "index.html";
  });
});
