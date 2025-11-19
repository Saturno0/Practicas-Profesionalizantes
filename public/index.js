document.addEventListener("DOMContentLoaded", () => {
  const LOCAL_API_URL = "http://localhost:3000";
  const productionOverride =
    typeof window.API_BASE_URL === "string" && window.API_BASE_URL.trim().length > 0
      ? window.API_BASE_URL.trim()
      : "https://tu-backend-en-produccion.com";
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const API_BASE_URL = isLocalhost ? LOCAL_API_URL : productionOverride;
  /* ===== Navbar toggle (mobile) ===== */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
      toggle.classList.toggle("nav-open");
    });
  }

  /* ===== Scroll reveal para secciones ===== */
  const reveals = document.querySelectorAll(".reveal");

  function handleReveal() {
    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight * 0.85) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", handleReveal);
  window.addEventListener("load", handleReveal);
  handleReveal();

  /* ===== Envío de formulario al backend (Node) ===== */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (status) {
        status.textContent = "Enviando mensaje...";
        status.style.color = "#555";
      }

      const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Error en el servidor");
        }

        if (status) {
          status.textContent =
            "Tu mensaje fue enviado correctamente. ¡Gracias por contactarnos!";
          status.style.color = "green";
        }
        form.reset();
      } catch (error) {
        console.error(error);
        if (status) {
          status.textContent =
            "Hubo un error al enviar el mensaje. Intenta nuevamente más tarde.";
          status.style.color = "red";
        }
      }
    });
  }
});
