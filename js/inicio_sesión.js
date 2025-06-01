document.addEventListener("DOMContentLoaded", () => {
  const loginform = document.getElementById("loginform");
  const errorElement = document.getElementById("error");

  loginform.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    errorElement.textContent = "";

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        errorElement.textContent = data.error || "Error al iniciar sesión";
        return;
      }

      // Guardar usuario activo
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      // Redirección
      const params = new URLSearchParams(window.location.search);
      const redirectURL = params.get('redirect');

      // notificación de ingreso
      Swal.fire({
        title: '¡Bienvenido Renewer!',
        text: 'Haz clic en OK para continuar.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          const redirectURL = new URLSearchParams(window.location.search).get("redirect");
          window.location.href = redirectURL ? decodeURIComponent(redirectURL) : "index.html";
        }
      });

    } catch (error) {
      errorElement.textContent = "No se pudo conectar al servidor.";
      console.error(error);
    }
  });
});
