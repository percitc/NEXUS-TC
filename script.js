// NEXUS-TC — Landing page script
document.addEventListener("DOMContentLoaded", () => {

  /* Año dinámico */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* WhatsApp centralizado */
  const WA_NUMBER = "51900448916";
  const WA_MSG_DEFAULT = "Hola, quisiera solicitar una demo de NEXUS-TC.";
  const waBase = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  ["hero-whatsapp","contacto-whatsapp","social-whatsapp","wa-float"].forEach(id => {
    const el = document.getElementById(id);
    if (el){ el.href = waBase(WA_MSG_DEFAULT); el.target="_blank"; el.rel="noopener noreferrer"; }
  });

  /* Menú móvil */
  const toggle = document.getElementById("nav-toggle");
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("main-nav");
  if (toggle && header && nav){
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      header.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded","false");
    }));
  }

  /* Animación voucher */
  const vStatus = document.getElementById("voucher-status");
  const vSeal   = document.getElementById("voucher-seal");
  if (vStatus && vSeal){
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    setTimeout(() => {
      vStatus.textContent = "comprobante válido";
      vStatus.classList.add("is-valid");
      vSeal.classList.add("is-shown");
    }, reduced ? 0 : 1400);
  }

  /* Partículas en el hero */
  const particleContainer = document.getElementById("particles");
  if (particleContainer){
    for (let i = 0; i < 30; i++){
      const p = document.createElement("div");
      p.className = "particle";
      p.style.cssText = `
        left:${Math.random()*100}%;
        width:${1+Math.random()*2}px;
        height:${1+Math.random()*2}px;
        animation-duration:${4+Math.random()*8}s;
        animation-delay:${Math.random()*6}s;
        bottom:0;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* =========================================================
     FORMULARIO → ENVIAR POR WHATSAPP
     ========================================================= */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form && status){
    form.addEventListener("submit", e => {
      e.preventDefault();

      const nombre   = form.nombre.value.trim();
      const empresa  = form.empresa.value.trim();
      const correo   = form.correo.value.trim();
      const telefono = form.telefono.value.trim();
      const plan     = form["empresas-gestionadas"].value;
      const mensaje  = form.mensaje.value.trim();

      /* Validación */
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!nombre){
        status.style.color="#D32F2F"; status.textContent="Por favor ingresa tu nombre completo.";
        form.nombre.focus(); return;
      }
      if (!correo || !emailOk){
        status.style.color="#D32F2F"; status.textContent="Ingresa un correo electrónico válido.";
        form.correo.focus(); return;
      }

      /* Armar mensaje de WhatsApp */
      const planLabels = {
        "2-5":"Básico (2-5 empresas)",
        "5-20":"Profesional (5-20 empresas)",
        "20-50":"Estudio (20-50 empresas)",
        "50-200":"Enterprise (50-200 empresas)"
      };
      const lines = [
        "🚀 *Solicitud de demo — NEXUS-TC*",
        "",
        `👤 *Nombre:* ${nombre}`,
        empresa ? `🏢 *Empresa:* ${empresa}` : null,
        `✉️ *Correo:* ${correo}`,
        telefono ? `📱 *Teléfono:* ${telefono}` : null,
        `📊 *Plan de interés:* ${planLabels[plan] || plan}`,
        mensaje ? `💬 *Mensaje:* ${mensaje}` : null,
      ].filter(Boolean).join("\n");

      /* Abrir WhatsApp */
      window.open(waBase(lines), "_blank", "noopener,noreferrer");

      /* Confirmación visual */
      status.style.color="#2E8B57";
      status.textContent = `✓ ¡Listo, ${nombre.split(" ")[0]}! Se abrió WhatsApp con tu información. Envía el mensaje y te contactamos pronto.`;
      form.reset();
    });
  }

});


/* =========================================================
   AUTOPLAY CON AUDIO — YouTube API
   Técnica: muted autoplay → luego unMute vía API + 
   desbloqueo por primer scroll/click del usuario
   ========================================================= */
(function(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  var player;
  var unmuted = false;

  function tryUnmute() {
    if (player && !unmuted) {
      try {
        player.unMute();
        player.setVolume(85);
        unmuted = true;
      } catch(e) {}
    }
  }

  window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player('yt-hero', {
      events: {
        onReady: function(e){
          e.target.mute();
          e.target.playVideo();
          // Intento 1: desmutear a los 500ms
          setTimeout(tryUnmute, 500);
        },
        onStateChange: function(e){
          // Intento 2: desmutear cuando empieza a reproducir
          if (e.data === YT.PlayerState.PLAYING) {
            setTimeout(tryUnmute, 200);
          }
        }
      }
    });
  };

  // Intento 3: al primer scroll o click del usuario, desmutear
  ['scroll','click','touchstart','keydown'].forEach(function(ev){
    window.addEventListener(ev, function handler(){
      tryUnmute();
      window.removeEventListener(ev, handler);
    }, { once: true });
  });
})();
