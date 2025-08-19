// ===== Esperar a que el DOM esté listo =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Noxhood: DOM cargado y listo");

  // --- Variables del carrito ---
  let carrito = [];
  let total = 0;

  // --- Elementos del DOM (con verificación) ---
  const carritoEl = document.getElementById("carrito");
  const listaCarritoEl = document.getElementById("lista-carrito");
  const totalCarritoEl = document.getElementById("carrito-total");
  const vaciarBtn = document.getElementById("vaciar-carrito");
  const btnCarrito = document.querySelector(".btn-carrito");
  

  // --- Toggle Carrito ---
  function toggleCarrito() {
    if (!carritoEl) {
      console.warn("⚠️ #carrito no encontrado");
      return;
    }

    carritoEl.classList.toggle("activo");
  }

  // Exponer la función globalmente
  window.toggleCarrito = toggleCarrito;

  // --- Añadir al carrito desde cualquier producto ---
  document.querySelectorAll(".producto .btn").forEach(boton => {
    boton.addEventListener("click", function (e) {
      e.preventDefault();

      if (this.textContent.includes("Añadir al carrito")) {
        const producto = this.closest(".producto");
        if (!producto) return;

        const nombre = producto.querySelector("h3").textContent;
        const precio = parseInt(producto.dataset.precio) || 50000;
        const imagen = producto.querySelector("img").src;

        carrito.push({ nombre, precio, imagen });
        total += precio;

        // Guardar en localStorage
        try {
          localStorage.setItem("carrito", JSON.stringify(carrito));
        } catch (e) {
          console.warn("⚠️ No se pudo guardar en localStorage");
        }

        renderCarrito();
        mostrarToast(`✅ ${nombre} añadido al carrito`);
      }

      if (this.textContent.includes("Pagar ya")) {
        window.location.href = "checkout.html";
      }
    });
  });

  // --- Renderizar carrito con imagen ---
  function renderCarrito() {
    if (!listaCarritoEl) return;
    listaCarritoEl.innerHTML = "";

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.gap = "12px";
      li.style.alignItems = "center";
      li.style.marginBottom = "10px";
      li.style.color = "#fff";

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

  // --- Vaciar carrito ---
  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      carrito = [];
      total = 0;
      renderCarrito();
    });
  }

  // --- Notificaciones ---
  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = mensaje;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  }

  // --- Cerrar carrito al hacer clic fuera ---
  document.addEventListener("click", (e) => {
    if (carritoEl && carritoEl.classList.contains("activo")) {
      if (!carritoEl.contains(e.target) && !btnCarrito?.contains(e.target)) {
        carritoEl.classList.remove("activo");
      }
    }
  });

  // --- Modo oscuro ---
  const modoBtn = document.getElementById("modo-btn");
  const logoHeader = document.getElementById("logo-header");
  const logoFooter = document.getElementById("logo-footer");

  if (modoBtn) {
    const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";
    if (modoOscuroGuardado) {
      document.body.classList.add("modo-oscuro");
      modoBtn.textContent = "☀ Modo claro";
    }

    if (logoHeader) logoHeader.src = modoOscuroGuardado ? "Imagenes/logo_claro.png" : "Imagenes/logo_oscuro.png";
    if (logoFooter) logoFooter.src = modoOscuroGuardado ? "Imagenes/logo_claro.png" : "Imagenes/logo_oscuro.png";

    modoBtn.addEventListener("click", () => {
      document.body.classList.toggle("modo-oscuro");
      const esModoOscuro = document.body.classList.contains("modo-oscuro");
      modoBtn.textContent = esModoOscuro ? "☀ Modo claro" : "🌙 Modo oscuro";

      if (logoHeader) logoHeader.src = esModoOscuro ? "Imagenes/logo_claro.png" : "Imagenes/logo_oscuro.png";
      if (logoFooter) logoFooter.src = esModoOscuro ? "Imagenes/logo_claro.png" : "Imagenes/logo_oscuro.png";

      localStorage.setItem("modoOscuro", esModoOscuro);
    });
  }

  // --- Ajuste de tamaño de fuente ---
  let currentFontSize = parseInt(localStorage.getItem("fontSize")) || 16;
  document.documentElement.style.fontSize = currentFontSize + "px";

  const increaseFont = document.getElementById("increase-font");
  const decreaseFont = document.getElementById("decrease-font");

  if (increaseFont) {
    increaseFont.addEventListener("click", () => {
      if (currentFontSize < 20) {
        currentFontSize++;
        document.documentElement.style.fontSize = currentFontSize + "px";
        localStorage.setItem("fontSize", currentFontSize);
      }
    });
  }

  if (decreaseFont) {
    decreaseFont.addEventListener("click", () => {
      if (currentFontSize > 10) {
        currentFontSize--;
        document.documentElement.style.fontSize = currentFontSize + "px";
        localStorage.setItem("fontSize", currentFontSize);
      }
    });
  }

  // --- Barra de búsqueda ---
  const searchBox = document.querySelector('.search-box');
  const searchToggle = document.querySelector('.search-toggle');

  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', () => {
      searchBox.classList.toggle('active');
    });
  }

  // 🎵 Reproductores de audio
  document.querySelectorAll(".audio-player").forEach(player => {
    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-pause");
    const seekBar = player.querySelector(".seek-bar");
    const time = player.querySelector(".time");

    if (audio && playBtn && seekBar && time) {
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
    }
  });

  // --- Animaciones de entrada ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .producto').forEach(el => {
    observer.observe(el);
  });

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

  // --- Funciones globales ---
  window.mostrarToast = mostrarToast;

  // --- Formatear precio (ej: 89.900) ---
  function formatearPrecio(precio) {
    return precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
});