// ============================================================
// NEXUS-TC — Landing page interactions
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const siteHeader = document.querySelector(".site-header");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && siteHeader && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteHeader.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- WhatsApp: número de contacto centralizado ---------- */
  const WHATSAPP_NUMBER = "51900448916";
  const WHATSAPP_MESSAGE = "Hola, quisiera solicitar una demo de NEXUS-TC.";
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  ["hero-whatsapp", "contacto-whatsapp", "social-whatsapp", "social-whatsapp-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("href", waUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* ---------- Animación del comprobante: "validando…" -> sello aprobado ---------- */
  const voucherStatus = document.getElementById("voucher-status");
  const voucherSeal = document.getElementById("voucher-seal");

  if (voucherStatus && voucherSeal) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReducedMotion ? 0 : 1400;

    setTimeout(() => {
      voucherStatus.textContent = "comprobante válido";
      voucherStatus.classList.add("is-valid");
      voucherSeal.classList.add("is-shown");
    }, delay);
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = form.nombre.value.trim();
      const correo = form.correo.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre) {
        formStatus.style.color = "var(--red-600)";
        formStatus.textContent = "Por favor ingresa tu nombre completo.";
        form.nombre.focus();
        return;
      }

      if (!correo || !emailPattern.test(correo)) {
        formStatus.style.color = "var(--red-600)";
        formStatus.textContent = "Ingresa un correo electrónico válido.";
        form.correo.focus();
        return;
      }

      // Punto de integración: aquí se conectaría el envío real
      // (endpoint propio, servicio de formularios, o correo).
      formStatus.style.color = "var(--green-ok)";
      formStatus.textContent = `Gracias, ${nombre.split(" ")[0]}. Tu solicitud fue registrada — te contactaremos pronto.`;
      form.reset();
    });
  }

});
