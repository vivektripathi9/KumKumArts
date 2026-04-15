// ── Mobile Navigation Toggle ──────────────────────────────────────────────────
(function () {
  const toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;

  function isOpen() {
    return document.body.classList.contains("nav-open");
  }

  function openNav() {
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    isOpen() ? closeNav() : openNav();
  });

  // Close when clicking outside the header
  document.addEventListener("click", function (e) {
    if (isOpen() && !e.target.closest(".site-header")) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      closeNav();
      toggle.focus();
    }
  });
})();

// ── Hero Slider ───────────────────────────────────────────────────────────────
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
  });
}

function startSlider() {
  slideTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4200);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    window.clearInterval(slideTimer);
    showSlide(index);
    startSlider();
  });
});

showSlide(0);
startSlider();

// ── Scroll Reveal Animations ──────────────────────────────────────────────────
(function () {
  const revealItems = Array.from(document.querySelectorAll(".reveal-up"));
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
})();
