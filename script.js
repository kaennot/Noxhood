// ===== Esperar a que el DOM esté listo =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Noxhood: DOM cargado y listo");

  // --- Estado del carrito ---
  let carrito = [];
  let total = 0;

  // --- Elementos del DOM ---
  const carritoEl = document.getElementById("carrito");
  const listaCarritoEl = document.getElementById("lista-carrito");
  const totalCarritoEl = document.getElementById("carrito-total");
  const vaciarBtn = document.getElementById("vaciar-carrito");
  const btnCarrito = document.querySelector(".btn-carrito");
  const modoBtn = document.getElementById("modo-btn");
  const logoHeader = document.getElementById("logo-header");
  const logoFooter = document.getElementById("logo-footer");
  const increaseFont = document.getElementById("increase-font");
  const decreaseFont = document.getElementById("decrease-font");
  const searchToggle = document.querySelector(".search-toggle");
  const searchBox = document.querySelector(".search-box");

  // --- Función global: toggleCarrito ---
  function toggleCarrito() {
    if (!carritoEl) return;
    carritoEl.classList.toggle("activo");
  }
  window.toggleCarrito = toggleCarrito;

  // --- Formatear precio (89.900) ---
  function formatearPrecio(precio) {
    return precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // --- Renderizar carrito ---
  function renderCarrito() {
    if (!listaCarritoEl) return;
    listaCarritoEl.innerHTML = "";

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.style.cssText = "display: flex; gap: 12px; align-items: center; margin-bottom: 10px; color: #fff;";
      li.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1; font-size: 14px;">
          <div><strong>${item.nombre}</strong></div>
          <div>$${formatearPrecio(item.precio)}</div>
        </div>
      `;
      listaCarritoEl.appendChild(li);
    });

    if (totalCarritoEl) {
      totalCarritoEl.textContent = `$${formatearPrecio(total)}`;
    }
  }

  // --- Añadir al carrito ---
  document.querySelectorAll(".producto .btn").forEach(boton => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();
      const producto = boton.closest(".producto");
      if (!producto) return;

      const nombre = producto.querySelector("h3").textContent;
      const precio = parseInt(producto.dataset.precio) || 50000;
      const imagen = producto.querySelector("img").src;

      if (boton.textContent.includes("Añadir al carrito")) {
        carrito.push({ nombre, precio, imagen });
        total += precio;
        guardarCarrito();
        renderCarrito();
        mostrarToast(`✅ ${nombre} añadido al carrito`);
      }

      if (boton.textContent.includes("Pagar ya")) {
        window.location.href = "checkout.html";
      }
    });
  });

  // --- Vaciar carrito ---
  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      carrito = [];
      total = 0;
      guardarCarrito();
      renderCarrito();
    });
  }

  // --- Guardar carrito en localStorage ---
  function guardarCarrito() {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (e) {
      console.warn("⚠️ No se pudo guardar en localStorage");
    }
  }

  // --- Cargar carrito desde localStorage ---
  try {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      total = carrito.reduce((sum, item) => sum + item.precio, 0);
      renderCarrito();
    }
  } catch (e) {
    console.warn("⚠️ No se pudo cargar el carrito desde localStorage");
  }

  // --- Notificaciones (toast) ---
  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
  window.mostrarToast = mostrarToast;

  // --- Cerrar carrito al hacer clic fuera ---
  document.addEventListener("click", (e) => {
    if (carritoEl && carritoEl.classList.contains("activo")) {
      const clicEnCarrito = carritoEl.contains(e.target);
      const clicEnBtn = btnCarrito && btnCarrito.contains(e.target);
      if (!clicEnCarrito && !clicEnBtn) {
        carritoEl.classList.remove("activo");
      }
    }
  });

  // --- Modo oscuro ---
  if (modoBtn) {
    const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";
    if (modoOscuroGuardado) {
      document.body.classList.add("modo-oscuro");
      modoBtn.textContent = "☀ Modo claro";
    }

    actualizarLogo(modoOscuroGuardado);

    modoBtn.addEventListener("click", () => {
      const esModoOscuro = !document.body.classList.contains("modo-oscuro");
      document.body.classList.toggle("modo-oscuro", esModoOscuro);
      modoBtn.textContent = esModoOscuro ? "☀ Modo claro" : "🌙 Modo oscuro";
      actualizarLogo(esModoOscuro);
      localStorage.setItem("modoOscuro", esModoOscuro);
    });
  }

  function actualizarLogo(esModoOscuro) {
    const src = esModoOscuro ? "Imagenes/logo_claro.png" : "Imagenes/logo_oscuro.png";
    if (logoHeader) logoHeader.src = src;
    if (logoFooter) logoFooter.src = src;
  }

  // --- Tamaño de fuente ---
  let currentFontSize = parseInt(localStorage.getItem("fontSize")) || 16;
  document.documentElement.style.fontSize = currentFontSize + "px";

  if (increaseFont) {
    increaseFont.addEventListener("click", () => {
      if (currentFontSize < 20) {
        currentFontSize++;
        aplicarTamaño();
      }
    });
  }

  if (decreaseFont) {
    decreaseFont.addEventListener("click", () => {
      if (currentFontSize > 10) {
        currentFontSize--;
        aplicarTamaño();
      }
    });
  }

  function aplicarTamaño() {
    document.documentElement.style.fontSize = currentFontSize + "px";
    localStorage.setItem("fontSize", currentFontSize);
  }

  // --- Búsqueda ---
  if (searchToggle && searchBox) {
    searchToggle.addEventListener("click", () => {
      searchBox.classList.toggle("active");
    });
  }

  // --- Reproductores de audio ---
  document.querySelectorAll(".audio-player").forEach(player => {
    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-pause");
    const seekBar = player.querySelector(".seek-bar");
    const time = player.querySelector(".time");

    if (!audio || !playBtn || !seekBar || !time) return;

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
      } else {
        audio.pause();
        playBtn.textContent = "▶";
      }
    });

    audio.addEventListener("timeupdate", () => {
      seekBar.max = audio.duration;
      seekBar.value = audio.currentTime;
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
      time.textContent = `${minutes}:${seconds}`;
    });

    seekBar.addEventListener("input", () => {
      audio.currentTime = seekBar.value;
    });

    audio.addEventListener("ended", () => {
      playBtn.textContent = "▶";
      seekBar.value = 0;
      time.textContent = "0:00";
    });
  });

  // --- Animaciones de entrada ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in, .producto").forEach(el => {
    observer.observe(el);
  });
});

// --- Chatbot flotante ---
const openChatbotBtn = document.getElementById("open-chatbot");
const chatbotContainer = document.querySelector(".chatbot-container");
const minimizeChatbot = document.getElementById("minimize-chatbot");
const chatbotInput = document.getElementById("chatbot-input");
const sendChatbot = document.getElementById("send-chatbot");
const chatbotMessages = document.getElementById("chatbot-messages");

// Abrir chatbot
openChatbotBtn?.addEventListener("click", () => {
  chatbotContainer.classList.add("active");
  openChatbotBtn.style.display = "none";
});

// Minimizar chatbot
minimizeChatbot?.addEventListener("click", () => {
  chatbotContainer.classList.remove("active");
  openChatbotBtn.style.display = "flex";
});

// Enviar mensaje
function enviarMensaje() {
  const texto = chatbotInput.value.trim();
  if (texto === "") return;

  // Mensaje del usuario
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user");
  userMsg.textContent = texto;
  chatbotMessages.appendChild(userMsg);

  // Limpiar input
  chatbotInput.value = "";

  // Scroll automático
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  // Respuesta del bot (simulada)
  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");

    const lowerText = texto.toLowerCase();

    if (lowerText.includes("hola") || lowerText.includes("hi")) {
      botMsg.textContent = "¡Hola! 👋 Bienvenido a Noxhood. ¿En qué puedo ayudarte?";
    } else if (lowerText.includes("precio") || lowerText.includes("cuánto")) {
      botMsg.textContent = "Los precios varían según la colección. Revisa nuestras camisas o pantalones para ver los valores actuales.";
    } else if (lowerText.includes("envío") || lowerText.includes("entrega")) {
      botMsg.textContent = "Hacemos envíos a todo Colombia. El tiempo de entrega es de 2 a 5 días hábiles.";
    } else if (lowerText.includes("camisa") || lowerText.includes("pantalón")) {
      botMsg.textContent = "Tenemos camisas y pantalones en diferentes estilos urbanos. ¿Te interesa alguna colección en especial?";
    } else if (lowerText.includes("gracias")) {
      botMsg.textContent = "¡De nada! 😊 ¿Necesitas ayuda con algo más?";
    } else if (lowerText.includes("adiós") || lowerText.includes("chao")) {
      botMsg.textContent = "¡Que tengas un excelente día! 👋";
    } else {
      botMsg.textContent = "Gracias por tu mensaje. Estoy aprendiendo, pero pronto podré ayudarte mejor. Mientras tanto, revisa nuestra tienda o contáctanos por WhatsApp.";
    }

    chatbotMessages.appendChild(botMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }, 600);
}

// Enviar con botón
sendChatbot?.addEventListener("click", enviarMensaje);

// Enviar con Enter
chatbotInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});
