# Design Document: Kumkum Arts — Art Retreat Website

## Overview

Kumkum Arts is a multi-page static website for a solo host offering pottery retreats, painting workshops, and weekend art escapes in nature locations (Himachal Pradesh). The site targets beginners, couples, and solo travelers. The aesthetic is Airbnb + Art Studio + Travel Experience — warm, tactile, and inviting.

The site is pure HTML/CSS/JS with no frameworks. All pages share a single `styles.css` and `script.js` (plus a page-specific inline `<script>` block where needed). The existing workspace already has a working visual foundation; this design extends it to satisfy all 18 requirements.

A new page `pages/event-detail.html` is introduced to satisfy Requirement 9. The existing `pages/stay.html` is repurposed/merged into the event detail page concept since the requirements do not list "Stay" as a primary nav destination.

---

## Architecture

```
index.html                  ← Homepage (Requirements 1–7, 13, 15, 16)
pages/
  events.html               ← Events listing + filter (Requirement 8)
  event-detail.html         ← Single event detail (Requirement 9)  [NEW]
  about.html                ← About the host (Requirement 10)
  gallery.html              ← Full gallery with categories (Requirement 11)
  contact.html              ← Contact form + WhatsApp + map (Requirement 12)
styles.css                  ← Shared design system + all component styles
script.js                   ← Shared JS: hero slider, lightbox, mobile nav
pages/events-filter.js      ← Events page filter logic  [NEW]
pages/gallery-filter.js     ← Gallery page category filter + lightbox  [NEW]
pages/contact-form.js       ← Contact form + newsletter validation  [NEW]
pages/event-detail.js       ← Sticky CTA scroll behavior  [NEW]
Images/                     ← Existing photo assets
```

### Navigation Structure

Every page shares the same `<header class="site-header">` with five nav links: Home, Events, Gallery, About, Contact. The active page link receives an `aria-current="page"` attribute and a `.is-active` CSS class applied by a small inline script on each page.

```
Home (index.html)
├── Events (pages/events.html)
│   └── Event Detail (pages/event-detail.html)
├── Gallery (pages/gallery.html)
├── About (pages/about.html)
└── Contact (pages/contact.html)
```

---

## Components and Interfaces

### Shared Header / Navigation

Present on every page. On mobile (< 768 px) the `.site-nav` and `.nav-button` are hidden and a hamburger `<button class="nav-toggle">` is shown. Clicking it toggles `.nav-open` on `<body>`, which slides the nav into view.

```html
<header class="site-header">
  <a class="brand" href="/index.html">…</a>
  <button class="nav-toggle" aria-label="Open navigation" aria-expanded="false">☰</button>
  <nav class="site-nav" aria-label="Primary navigation">
    <a href="…" class="is-active" aria-current="page">Home</a>
    …
  </nav>
  <a class="nav-button" href="pages/contact.html">Book Your Spot</a>
</header>
```

Active-link detection (inline script at bottom of each page):
```js
document.querySelectorAll('.site-nav a').forEach(a => {
  if (a.href === location.href) {
    a.classList.add('is-active');
    a.setAttribute('aria-current', 'page');
  }
});
```

### Event_Card

Used on the homepage (featured + upcoming) and on `events.html`. Data attributes drive filtering and navigation.

```html
<article class="event-card" data-type="pottery" data-location="bir" data-duration="3">
  <img src="…" alt="…">
  <div class="event-card-body">
    <span class="event-tag">Pottery Retreat</span>
    <!-- Limited seats badge (conditional) -->
    <span class="limited-tag" aria-label="Limited seats available">Only 3 seats left</span>
    <h3>Hand-Building Pottery in Bir</h3>
    <p class="event-meta"><span>📍 Bir, HP</span> <span>Apr 24–26</span> <span>₹7,000</span></p>
    <a class="button button-primary" href="event-detail.html?id=pottery-bir-apr">View Details</a>
  </div>
</article>
```

### Filter_Bar

On `events.html`. Three `<select>` elements (location, type, duration) plus a "Clear" button. JavaScript listens for `change` events and re-renders visible cards without page reload.

```html
<div class="filter-bar" role="search" aria-label="Filter events">
  <select id="filter-location" aria-label="Filter by location">…</select>
  <select id="filter-type" aria-label="Filter by type">…</select>
  <select id="filter-duration" aria-label="Filter by duration">…</select>
  <button class="button button-secondary" id="filter-clear">Clear</button>
</div>
<p class="no-results" hidden>No events match your filters. Try adjusting your search.</p>
```

### Lightbox

A single `<div id="lightbox">` injected into the DOM by `script.js` on first use. All gallery images on any page get a `data-lightbox` attribute. A delegated click listener on `document` opens the lightbox.

```html
<div id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
  <button class="lightbox-prev" aria-label="Previous image">‹</button>
  <figure>
    <img id="lightbox-img" src="" alt="">
    <figcaption id="lightbox-caption"></figcaption>
  </figure>
  <button class="lightbox-next" aria-label="Next image">›</button>
  <button class="lightbox-close" aria-label="Close image viewer">✕</button>
</div>
```

The lightbox maintains an internal array of `{ src, alt }` objects built from all `[data-lightbox]` images in the current page context. Prev/next cycle through this array.

### Sticky_CTA (Event Detail Page)

A `<div class="sticky-cta">` fixed to the bottom of the viewport on `event-detail.html`. It is hidden initially and becomes visible once the user scrolls past the page header booking button (detected via `IntersectionObserver`).

```html
<div class="sticky-cta" hidden>
  <span class="sticky-cta-title">Hand-Building Pottery in Bir</span>
  <a class="button button-primary" href="contact.html">Book Now — ₹7,000</a>
</div>
```

### Newsletter_Form

Reusable form component placed on the homepage and optionally on other pages.

```html
<form class="newsletter-form" novalidate>
  <label for="newsletter-email" class="sr-only">Email address</label>
  <input type="email" id="newsletter-email" placeholder="Your email address" required>
  <button type="submit" class="button button-primary">Get Early Access</button>
  <p class="form-feedback" role="alert" aria-live="polite" hidden></p>
</form>
```

### Contact Form

On `contact.html`. Three required fields. Client-side validation before any submission attempt.

```html
<form class="contact-form" novalidate>
  <div class="field-group">
    <label for="contact-name">Name</label>
    <input type="text" id="contact-name" name="name" required>
    <span class="field-error" role="alert" hidden></span>
  </div>
  <div class="field-group">
    <label for="contact-email">Email</label>
    <input type="email" id="contact-email" name="email" required>
    <span class="field-error" role="alert" hidden></span>
  </div>
  <div class="field-group">
    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" rows="5" required></textarea>
    <span class="field-error" role="alert" hidden></span>
  </div>
  <button type="submit" class="button button-primary">Send Message</button>
  <p class="form-feedback" role="alert" aria-live="polite" hidden></p>
</form>
```

---

## Data Models

Since this is a static site with no backend, "data" is represented as JavaScript arrays of plain objects defined inline in each page's script block or in a shared `data.js` constant.

### Event Object

```js
{
  id: "pottery-bir-apr",          // string — used in URL query param
  title: "Hand-Building Pottery in Bir",
  type: "pottery",                // "pottery" | "painting" | "escape"
  location: "bir",                // slug matching filter option values
  locationLabel: "Bir, HP",
  date: "Apr 24–26, 2025",
  price: 7000,                    // number in INR
  priceLabel: "₹7,000",
  seatsLeft: 3,                   // number; <= SEATS_THRESHOLD triggers limited tag
  image: "../Images/19777.jpg",
  imageAlt: "Clay and pottery workshop",
  duration: 3,                    // days
  description: "…",
  itinerary: [                    // array of day objects
    { day: 1, title: "Arrival & Clay", activities: ["…"] },
    …
  ],
  included: ["Stay (shared dorm)", "All meals", "Art supplies", "Guided sessions"],
  whoIsItFor: ["Beginners", "Couples", "Solo travelers"],
  gallery: ["../Images/19777.jpg", "…"],
  faqs: [
    { q: "Do I need prior experience?", a: "No, all sessions are beginner-friendly." },
    …
  ]
}
```

`SEATS_THRESHOLD = 5` — events with `seatsLeft <= SEATS_THRESHOLD` display the `Limited_Seats_Tag`.

### Gallery Photo Object

```js
{
  src: "../Images/1063.jpg",
  alt: "Pottery session at Bir retreat",
  caption: "Shaping clay on Day 1",
  category: "pottery"            // "pottery" | "painting" | "moments"
}
```

### Testimonial Object

```js
{
  quote: "Three days that changed how I see creativity.",
  name: "Priya S.",
  event: "Pottery Retreat, Bir — April 2024"
}
```

---

## Visual Design System

### Color Tokens (existing, extended)

| Token | Value | Usage |
|---|---|---|
| `--cream` | `#fff7ef` | Page background base |
| `--beige` | `#f3d7c4` | Soft panel backgrounds |
| `--terracotta` | `#ee7658` | Primary brand, CTAs, eyebrows |
| `--terracotta-dark` | `#d85e45` | Hover states |
| `--brown` | `#49342c` | Body text, headings |
| `--blush` | `#ffbea8` | Tags, accents |
| `--rose` | `#ff8fa3` | Gradient partner to terracotta |
| `--sun` | `#ffd166` | Hero accent, active dots |
| `--mint` | `#87d7bf` | Success states, confirmation messages |
| `--white` | `#fffdf9` | Card surfaces |
| `--line` | `rgba(73,52,44,0.14)` | Borders |
| `--shadow` | `0 22px 55px rgba(201,123,99,0.18)` | Card elevation |

New tokens to add:
```css
--error: #c0392b;
--success: #2d7a5f;
--overlay: rgba(30, 18, 14, 0.82);  /* lightbox backdrop */
```

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Display headings (h1) | Playfair Display | 4.8rem → 2.55rem (mobile) | 700 |
| Section headings (h2) | Playfair Display | 3rem → 2rem (mobile) | 600 |
| Card headings (h3) | Playfair Display | 1.45rem | 600 |
| Body / UI | Poppins | 1rem | 400 |
| Eyebrow labels | Poppins | 0.78rem | 700 uppercase |
| Prices | Playfair Display | 2.2rem | 700 |

### Spacing Scale

Uses a base-8 scale: 8, 16, 24, 32, 48, 64, 96 px. Sections use `margin-top: 96px`. Cards use `padding: 24–36px`. Gaps use `16–32px`.

### Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Mobile | < 620px | Single column, full-width buttons, stacked nav |
| Tablet | 620–900px | Two-column grids, condensed typography |
| Desktop | > 900px | Full multi-column layouts |

---

## Page-by-Page Layout

### Homepage (index.html)

Sections in order:
1. `<header>` — sticky nav
2. `.hero.hero-slider` — full-viewport image slider with tagline "Create. Relax. Experience Art in Nature." and "Explore Events" CTA
3. `.quick-details` — 3-column strip (Duration, Investment, Location)
4. `.featured-experiences` — 3 Event_Cards (Pottery, Painting, Weekend Escape) linking to filtered events page
5. `.upcoming-events` — 3 upcoming event listings with Limited_Seats_Tag where applicable
6. `.why-section` — "Why Choose Us" with 4 icon+text items
7. `.gallery-section` — 6-photo grid with lightbox
8. `.testimonials-section` — 2+ testimonial cards
9. `.before-you-join` — preparation tips list (Requirement 13)
10. `.gift-section` — "Gift an Experience" with WhatsApp/Contact CTA (Requirement 15)
11. `.newsletter-section` — Newsletter_Form (Requirement 16)
12. `.cta-section` — "Join the Next Retreat" + "Book Now" button
13. `<footer>`

### Events Page (pages/events.html)

1. `<header>`
2. `.subpage-heading` — page title
3. `.highlight-strip` — "Small batches | Expert guidance | All materials included"
4. `.filter-bar` — location / type / duration selects
5. `.event-grid` — Event_Cards (filtered dynamically)
6. `.no-results` (hidden by default)
7. `<footer>`

### Event Detail Page (pages/event-detail.html) — NEW

1. `<header>`
2. `.event-detail-hero` — title, location, price, booking CTA
3. `.about-experience` — descriptive paragraph
4. `.itinerary-section` — day-wise timeline
5. `.whats-included` — included items list
6. `.who-is-it-for` — audience tags
7. `.event-gallery` — photo grid with lightbox
8. `.faq-section` — accordion Q&A (min 3)
9. `.sticky-cta` — fixed bottom bar (shown on scroll)
10. `<footer>`

### About Page (pages/about.html)

1. `<header>`
2. `.her-story` — host origin story
3. `.mission-section` — art + experience mission
4. `.bts-photos` — behind-the-scenes photo grid
5. `.personal-note` — handwritten-style note from host
6. `<footer>`

### Gallery Page (pages/gallery.html)

1. `<header>`
2. `.subpage-heading`
3. `.category-filter` — Pottery / Painting / Retreat Moments buttons
4. `.gallery-grid` — responsive photo grid with `data-category` attributes
5. Lightbox (shared component)
6. `<footer>`

### Contact Page (pages/contact.html)

1. `<header>`
2. `.contact-hero` — heading + subtext
3. `.contact-grid` — two columns: contact form (left) + sidebar (right)
4. Sidebar: WhatsApp_CTA button, Instagram link, embedded map `<iframe>`
5. `<footer>`

---

## JavaScript Interactions

### script.js (shared, loaded on all pages)

Responsibilities:
- Hero image slider (existing)
- Mobile nav toggle (hamburger)
- Lightbox: build image list from `[data-lightbox]` elements, open/close/prev/next
- Active nav link detection

```js
// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const body = document.body;
navToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Lightbox
function buildLightboxImages() {
  return Array.from(document.querySelectorAll('[data-lightbox]'))
    .map(img => ({ src: img.src, alt: img.alt, caption: img.dataset.caption || img.alt }));
}
```

### pages/events-filter.js

Reads filter values on `change`, iterates `.event-card` elements, toggles `hidden` attribute based on `data-type`, `data-location`, `data-duration` matching. Shows `.no-results` when count is zero.

```js
function applyFilters() {
  const type = typeSelect.value;
  const location = locationSelect.value;
  const duration = durationSelect.value;
  let visible = 0;
  cards.forEach(card => {
    const match =
      (!type || card.dataset.type === type) &&
      (!location || card.dataset.location === location) &&
      (!duration || card.dataset.duration === duration);
    card.hidden = !match;
    if (match) visible++;
  });
  noResults.hidden = visible > 0;
}
```

### pages/gallery-filter.js

Category filter buttons toggle `.is-active` class and filter `.gallery-grid img[data-category]` elements. Lightbox is initialized from the filtered visible set.

### pages/contact-form.js

Validates contact form and newsletter form. Validation rules:
- Name: non-empty after trim
- Email: matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Message: non-empty after trim

On valid submit: shows `.form-feedback` success message, resets form.
On invalid submit: shows per-field `.field-error` messages, focuses first invalid field.

### pages/event-detail.js

Uses `IntersectionObserver` to watch the hero booking CTA. When it leaves the viewport, the `.sticky-cta` becomes visible (`hidden` removed). When it re-enters, sticky CTA is hidden again.

---

## Responsive Layout Strategy

### Mobile Nav (< 768px)

`.site-nav` and `.nav-button` are hidden via CSS. `.nav-toggle` button is shown. When `body.nav-open` is set, `.site-nav` slides down as a full-width dropdown with `position: absolute; top: 100%; left: 0; width: 100%`.

```css
@media (max-width: 767px) {
  .nav-toggle { display: flex; }
  .site-nav { display: none; }
  .nav-button { display: none; }
  body.nav-open .site-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--white);
    padding: 16px;
    border-bottom: 1px solid var(--line);
  }
}
```

### Grid Collapse

| Component | Desktop | Tablet (< 900px) | Mobile (< 620px) |
|---|---|---|---|
| Event grid | 3 columns | 2 columns | 1 column |
| Gallery grid | 4 columns (masonry-like) | 2 columns | 1 column |
| Why grid | 4–5 columns | 2 columns | 1 column |
| Quick details | 3 columns | 3 columns | 1 column |
| Contact grid | 2 columns | 1 column | 1 column |
| Itinerary | 2 columns | 1 column | 1 column |

---

## Error Handling

### Video Fallback (Req 1.4)

If a `<video>` element is used in the hero, it must include a `poster` attribute pointing to the fallback image, and a `<source>` with `onerror` handling:

```html
<video autoplay muted loop playsinline poster="Images/2148153673.jpg">
  <source src="Images/hero.mp4" type="video/mp4">
</video>
```

The `poster` attribute serves as the static fallback if the video fails to load or is unsupported.

### Form Validation Errors

- Per-field inline error messages using `<span class="field-error" role="alert">` 
- Error state adds `.has-error` class to `.field-group` for red border styling
- First invalid field receives `focus()` for accessibility
- Errors are cleared on the next `input` event for that field

### Filter No-Results

When all event cards are hidden by filters, a `.no-results` paragraph becomes visible with the message "No events match your filters. Try adjusting your search or clearing filters."

### Lightbox Edge Cases

- If only one image is in the lightbox set, prev/next buttons are hidden
- Keyboard: `Escape` closes, `ArrowLeft`/`ArrowRight` navigate
- Clicking the backdrop (outside the image) closes the lightbox
- `aria-modal="true"` and focus trap prevent background interaction

---

## Testing Strategy

### Unit Tests

Unit tests verify specific examples, edge cases, and integration points. They should focus on:

- Correct DOM structure on each page (required sections, elements, text content)
- Navigation links present and pointing to correct hrefs on every page
- Active nav link detection logic
- WhatsApp CTA href format
- Sticky CTA CSS positioning property
- Lightbox DOM structure (prev/next/close buttons present)
- Newsletter and contact form DOM structure (all required fields present)

### Property-Based Tests

Property tests verify universal behaviors across many generated inputs. Use a property-based testing library appropriate for the target language. For JavaScript, use **fast-check**.

Each property test must run a minimum of **100 iterations**.

Tag format for each test: `Feature: art-retreat-website, Property {N}: {property_text}`


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Event card links carry filter context

*For any* event card on the homepage Featured Experiences section, the card's link href must include the events page URL and a query parameter identifying the experience type, so that clicking any card navigates to the events page pre-filtered to that type.

**Validates: Requirements 2.3**

---

### Property 2: Event listings display required metadata

*For any* event object rendered as a listing on the homepage Upcoming Events section, the rendered HTML must contain the event's location, date, and price.

**Validates: Requirements 3.2**

---

### Property 3: Limited seats tag appears for low-availability events

*For any* event object where `seatsLeft <= SEATS_THRESHOLD`, the rendered Event_Card and Event_Detail_Page must both contain a `.limited-tag` element. For any event where `seatsLeft > SEATS_THRESHOLD`, neither should contain the tag.

**Validates: Requirements 3.3, 14.1**

---

### Property 4: Event listing links navigate to detail page

*For any* event card rendered on the events page, the "View Details" link href must point to `event-detail.html` with the correct event `id` query parameter.

**Validates: Requirements 3.4**

---

### Property 5: Gallery lightbox opens for any photo

*For any* image element with a `data-lightbox` attribute on any page, clicking it must result in the `#lightbox` element becoming visible (i.e., `hidden` attribute removed) and the lightbox image `src` matching the clicked image's `src`.

**Validates: Requirements 5.2, 11.4**

---

### Property 6: Testimonials contain all required fields

*For any* testimonial object rendered in the Testimonials section, the rendered HTML must contain the quote text, the participant's name, and the event they attended.

**Validates: Requirements 6.2**

---

### Property 7: Event filter hides non-matching cards

*For any* combination of filter values (location, type, duration) applied to the events page, every visible Event_Card must satisfy all active filter criteria, and every Event_Card that does not satisfy the criteria must be hidden.

**Validates: Requirements 8.2**

---

### Property 8: Event cards on events page contain required elements

*For any* event object rendered as an Event_Card on the events page, the card must contain: an image, a title, a location, a date, a price, and a "View Details" button.

**Validates: Requirements 8.3**

---

### Property 9: No-results message shown when filter yields zero matches

*For any* filter state that results in zero visible Event_Cards, the `.no-results` element must be visible. For any filter state that results in at least one visible card, the `.no-results` element must be hidden.

**Validates: Requirements 8.5**

---

### Property 10: Gallery category filter shows only matching photos

*For any* category selected in the Gallery_Page filter, every visible image in the `.gallery-grid` must have a `data-category` attribute matching the selected category. Images with a different category must be hidden.

**Validates: Requirements 11.2**

---

### Property 11: Lightbox navigation cycles through all photos

*For any* sequence of next/previous navigation actions in the lightbox, the displayed image index must cycle correctly through the full set of lightbox images without going out of bounds, wrapping around at the ends.

**Validates: Requirements 11.5**

---

### Property 12: Contact form confirmation shown on valid submission

*For any* form submission where name is non-empty, email matches the valid email pattern, and message is non-empty, the `.form-feedback` success message must become visible and the form must be reset.

**Validates: Requirements 12.2**

---

### Property 13: Contact form validation errors identify missing fields

*For any* form submission where one or more required fields (name, email, message) are empty or invalid, a `.field-error` element must be visible adjacent to each invalid field, and no confirmation message must be shown.

**Validates: Requirements 12.3**

---

### Property 14: Newsletter confirmation shown on valid email

*For any* newsletter form submission where the email input matches the valid email pattern, the confirmation message must become visible.

**Validates: Requirements 16.2**

---

### Property 15: Newsletter validation error shown for invalid email

*For any* newsletter form submission where the email input is empty or does not match the valid email pattern, a validation error must be displayed and no confirmation message must be shown.

**Validates: Requirements 16.3**

---

### Property 16: Mobile nav shows all links when opened

*For any* state where the mobile navigation is open (`body.nav-open` is set), all five primary navigation links (Home, Events, Gallery, About, Contact) must be visible in the DOM.

**Validates: Requirements 17.3**

---

### Property 17: Navigation bar present with all links on every page

*For any* page in the site, the `<header>` must contain a `<nav>` with links whose hrefs resolve to each of the five primary destinations: Home, Events, Gallery, About, and Contact.

**Validates: Requirements 18.1**

---

### Property 18: Active nav link matches current page

*For any* page in the site, exactly one navigation link must have the `.is-active` class and `aria-current="page"` attribute, and that link's href must match the current page's URL.

**Validates: Requirements 18.2**
