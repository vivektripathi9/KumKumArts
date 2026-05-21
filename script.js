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

// ── Home Gallery Auto Carousel (all instances: home, current event, etc.) ─────
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getPerView() {
    if (window.matchMedia("(max-width: 620px)").matches) return 1;
    if (window.matchMedia("(max-width: 900px)").matches) return 2;
    return 4;
  }

  /** @returns {{ recalc: () => void, startAutoplay: () => void } | null} */
  function initHomeGalleryCarousel(carousel) {
    const track = carousel.querySelector("[data-home-gallery-track]");
    const dotsWrap = carousel.querySelector(".home-gallery-dots");
    if (!track || !dotsWrap) return null;

    const cards = Array.from(track.querySelectorAll(".home-gallery-card"));
    if (!cards.length) return null;

    let index = 0;
    let maxIndex = 0;
    let timerId = 0;
    let dots = [];

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
      const w = firstCard.offsetWidth;
      if (!w) return;
      const step = w + gap;
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
      if (reduceMotion.matches) return;
      timerId = window.setInterval(() => {
        index = index >= maxIndex ? 0 : index + 1;
        render();
      }, 3500);
    }

    function onResize() {
      recalc();
    }

    carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
    carousel.addEventListener("mouseleave", startAutoplay);
    window.addEventListener("resize", onResize);

    recalc();
    startAutoplay();

    return { recalc, startAutoplay };
  }

  const instances = Array.from(document.querySelectorAll(".home-gallery-carousel"))
    .map(initHomeGalleryCarousel)
    .filter(Boolean);

  if (!instances.length) return;

  reduceMotion.addEventListener("change", () => {
    instances.forEach((inst) => {
      inst.recalc();
      inst.startAutoplay();
    });
  });
})();

/** Kumkum Arts retreat photos — files under /Event/ at site root */
/** Banner-only Event shots (hero / travel strip — keep out of this list): IMG_0251, 0276, 0369, 0246, 0136, 0201, 0229, 0431 (home hero), IMG_0265 (CE hero), IMG_0505 (CE travel) — all .JPG.jpeg. */
const KUMKUM_EVENT_PHOTO_POOL = [
  "Event/IMG_2895.JPG",
  "Event/IMG_2886.JPG",
  "Event/IMG_2879.JPG",
  "Event/IMG_2670.JPG",
  "Event/IMG_2686.JPG",
  "Event/IMG_2700.JPG",
  "Event/IMG_2889.JPG",
  "Event/IMG_2897.JPG",
  "Event/IMG_2867.JPG",
  "Event/IMG_2868.JPG",
  "Event/IMG_2880.JPG",
  "Event/IMG_2682.JPG",
  "Event/IMG_2701.JPG",
  "Event/IMG_3608.JPG",
  "Event/IMG_3595.JPG",
  "Event/IMG_3600.JPG",
  "Event/IMG_3601.JPG",
  "Event/IMG_3891.JPG",
];

// ── Home Manali section — rotating retreat photos ─────────────────────────────
(function initManaliVisualRotate() {
  const root = document.querySelector("[data-manali-visual-rotate]");
  if (!root) return;

  const imgs = Array.from(root.querySelectorAll("img[data-manali-rot-index]")).sort(
    (a, b) => Number(a.dataset.manaliRotIndex) - Number(b.dataset.manaliRotIndex)
  );
  if (imgs.length !== 3) return;

  const pool = KUMKUM_EVENT_PHOTO_POOL;
  if (pool.length < 3) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let offset = 0;
  let timerId = 0;
  const INTERVAL_MS = 4200;
  const FADE_MS = 380;

  function applySources() {
    imgs[0].src = pool[offset % pool.length];
    imgs[1].src = pool[(offset + 1) % pool.length];
    imgs[2].src = pool[(offset + 2) % pool.length];
  }

  function tick() {
    offset = (offset + 1) % pool.length;
    imgs.forEach((img) => {
      img.style.opacity = "0";
    });
    window.setTimeout(() => {
      applySources();
      requestAnimationFrame(() => {
        imgs.forEach((img) => {
          img.style.opacity = "1";
        });
      });
    }, FADE_MS);
  }

  function start() {
    window.clearInterval(timerId);
    if (reduceMotion.matches) {
      imgs.forEach((img) => {
        img.style.opacity = "";
      });
      return;
    }
    timerId = window.setInterval(tick, INTERVAL_MS);
  }

  applySources();
  imgs[0].setAttribute(
    "alt",
    "Rotating photos from Kumkum Arts retreats in Manali and the mountains"
  );
  imgs[1].setAttribute("alt", "");
  imgs[2].setAttribute("alt", "");
  imgs[1].setAttribute("aria-hidden", "true");
  imgs[2].setAttribute("aria-hidden", "true");

  root.addEventListener("mouseenter", () => window.clearInterval(timerId));
  root.addEventListener("mouseleave", start);

  reduceMotion.addEventListener("change", () => {
    applySources();
    start();
  });

  start();
})();

// ── Home “Why join” — one block: image and copy advance together ────────────
(function initHomeWhyJoinShowcase() {
  const root = document.querySelector("[data-home-why-showcase]");
  if (!root) return;

  const img = root.querySelector("img[data-home-why-rot-img]");
  const slides = Array.from(root.querySelectorAll("[data-home-why-slide]"));
  const dotsWrap = root.querySelector(".home-why-dots");
  if (!img || slides.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const INTERVAL_MS = 5600;
  const FADE_MS = 280;
  let index = 0;
  let timerId = 0;
  /** @type {HTMLButtonElement[]} */
  const dots = [];

  function slideSrc(i) {
    const raw = slides[i].dataset.homeWhyImage;
    return raw && raw.trim() ? raw.trim() : img.getAttribute("src") || "";
  }

  function show(nextIndex) {
    const n = slides.length;
    index = ((nextIndex % n) + n) % n;
    slides.forEach((s, j) => {
      s.classList.toggle("is-active", j === index);
    });
    const src = slideSrc(index);
    if (src) img.src = src;
    const title = slides[index].querySelector("h3");
    if (title) {
      img.alt = title.textContent.trim();
    }
    dots.forEach((d, j) => {
      d.classList.toggle("is-active", j === index);
    });
  }

  function tick() {
    if (reduceMotion.matches) {
      show(index + 1);
      return;
    }
    img.style.opacity = "0";
    window.setTimeout(() => {
      show(index + 1);
      window.requestAnimationFrame(() => {
        img.style.opacity = "1";
      });
    }, FADE_MS);
  }

  function start() {
    window.clearInterval(timerId);
    timerId = window.setInterval(tick, INTERVAL_MS);
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((slide, j) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const label = slide.querySelector("h3");
      const labelText = label ? label.textContent.trim() : `Point ${j + 1}`;
      btn.setAttribute("aria-label", `Show: ${labelText}`);
      btn.classList.toggle("is-active", j === 0);
      btn.addEventListener("click", () => {
        window.clearInterval(timerId);
        if (reduceMotion.matches) {
          show(j);
          start();
          return;
        }
        img.style.opacity = "0";
        window.setTimeout(() => {
          show(j);
          window.requestAnimationFrame(() => {
            img.style.opacity = "1";
          });
          start();
        }, FADE_MS);
      });
      dotsWrap.appendChild(btn);
      dots.push(btn);
    });
  }

  show(0);

  root.addEventListener("mouseenter", () => window.clearInterval(timerId));
  root.addEventListener("mouseleave", start);

  reduceMotion.addEventListener("change", () => {
    img.style.opacity = "";
    show(index);
    start();
  });

  start();
})();

(function initInstagramScroller() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-ig-scroller]").forEach((viewport) => {
    const wrap = viewport.closest(".ig-scroller-wrap");
    const prev = wrap?.querySelector(".ig-scroll-prev");
    const next = wrap?.querySelector(".ig-scroll-next");
    if (!prev || !next) return;

    function scrollByDirection(dir) {
      const amount = Math.max(200, Math.floor(viewport.clientWidth * 0.85));
      viewport.scrollBy({
        left: dir * amount,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    }

    prev.addEventListener("click", () => scrollByDirection(-1));
    next.addEventListener("click", () => scrollByDirection(1));

    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByDirection(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByDirection(1);
      }
    });
  });
})();
