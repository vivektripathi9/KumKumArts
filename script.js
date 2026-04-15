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

// ── Testimonials Carousel ─────────────────────────────────────────────────────
(function () {
  const pages = Array.from(
    document.querySelectorAll(".testimonials-carousel .testimonial-page")
  );
  const dots = Array.from(document.querySelectorAll("[data-testimonial-dot]"));
  if (!pages.length) return;

  let currentIndex = 0;
  let timerId;

  function showTestimonialPage(index) {
    currentIndex = (index + pages.length) % pages.length;

    pages.forEach((page, pageIndex) => {
      const isActive = pageIndex === currentIndex;
      page.classList.toggle("is-active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function startAutoplay() {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      showTestimonialPage(currentIndex + 1);
    }, 4800);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonialPage(index);
      startAutoplay();
    });
  });

  const carousel = document.querySelector(".testimonials-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
    carousel.addEventListener("mouseleave", startAutoplay);
  }

  showTestimonialPage(0);
  startAutoplay();
})();

// ── Home Gallery Auto Carousel ────────────────────────────────────────────────
(function () {
  const track = document.querySelector("[data-home-gallery-track]");
  const dotsWrap = document.querySelector(".home-gallery-dots");
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".home-gallery-card"));
  if (!cards.length) return;

  let index = 0;
  let maxIndex = 0;
  let timerId;
  let dots = [];

  function getPerView() {
    if (window.matchMedia("(max-width: 620px)").matches) return 1;
    if (window.matchMedia("(max-width: 900px)").matches) return 2;
    return 4;
  }

  function buildDots(count) {
    dotsWrap.innerHTML = "";
    dots = Array.from({ length: count }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Show gallery slide ${i + 1}`);
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        index = i;
        render();
        startAutoplay();
      });
      dotsWrap.appendChild(btn);
      return btn;
    });
  }

  function render() {
    const firstCard = cards[0];
    const gap = Number.parseFloat(window.getComputedStyle(track).gap || "10");
    const step = firstCard.offsetWidth + gap;
    track.style.transform = `translateX(-${index * step}px)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function recalc() {
    const perView = getPerView();
    maxIndex = Math.max(0, cards.length - perView);
    if (index > maxIndex) index = 0;
    buildDots(maxIndex + 1);
    render();
  }

  function startAutoplay() {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      index = index >= maxIndex ? 0 : index + 1;
      render();
    }, 3000);
  }

  const carousel = document.querySelector(".home-gallery-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
    carousel.addEventListener("mouseleave", startAutoplay);
  }

  window.addEventListener("resize", recalc);
  recalc();
  startAutoplay();
})();

