fetch("header.html")
    .then(response => response.text())
    .then(data => {
    document.getElementById("nav").innerHTML = data;

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const contenedorBotones = document.getElementById("botonesSesion");

    if (contenedorBotones) {
        contenedorBotones.innerHTML = "";

        if (isLoggedIn === "true") {
        const perfilBtn = document.createElement("button");
        perfilBtn.textContent = "Mi perfil";
        perfilBtn.className = "button";
        perfilBtn.onclick = () => window.location.href = "perfil.html";
        contenedorBotones.appendChild(perfilBtn);

        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Cerrar sesión";
        logoutBtn.className = "button";
        logoutBtn.onclick = () => {
            localStorage.removeItem("isLoggedIn");
            location.reload();
            window.location.href="index.html";
        };
        contenedorBotones.appendChild(logoutBtn);

        const nav = document.querySelector(".nav");        
        if (nav) {
            const mensajesLink = document.createElement("a");
            mensajesLink.href = "mensajes.html";
            mensajesLink.textContent = "Mensajes";
            mensajesLink.className = "textonav";
            nav.appendChild(mensajesLink);
        }

        const nav2 = document.querySelector(".nav2");        
        if (nav2) {
            const mensajesLink2 = document.createElement("a");
            mensajesLink2.href = "mensajes.html";
            mensajesLink2.textContent = "Mensajes";
            mensajesLink2.className = "textonav";
            nav2.appendChild(mensajesLink2);
        }

        } else {
        const loginBtn = document.createElement("button");
        loginBtn.textContent = "Iniciar Sesión";
        loginBtn.className = "button";
        loginBtn.onclick = () => window.location.href = "iniciar_sesion.html";
        contenedorBotones.appendChild(loginBtn);
        }
    }
    
    const enlaces = document.querySelectorAll(".textonav");
    const actual = window.location.pathname.split("/").pop();
    enlaces.forEach(enlace => {
        if (enlace.getAttribute("href") === actual) {
        enlace.classList.add("activo");
        }
    });
    });