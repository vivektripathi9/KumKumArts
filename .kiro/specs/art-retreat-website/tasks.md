# Implementation Plan: Kumkum Arts — Art Retreat Website

## Overview

Implement the full multi-page static site in pure HTML/CSS/JS, building from the existing workspace files. Tasks proceed from shared foundations (design system, navigation) through page-by-page sections to JavaScript interactions and testing.

## Tasks

- [x] 1. Extend styles.css with the complete design system
  - Add CSS custom properties: `--error`, `--success`, `--overlay` (new tokens from design)
  - Add shared component styles: `.event-card`, `.limited-tag`, `.filter-bar`, `.no-results`, `.lightbox`, `.sticky-cta`, `.newsletter-form`, `.contact-form`, `.field-group`, `.field-error`, `.form-feedback`, `.category-filter`, `.highlight-strip`, `.subpage-heading`
  - Add responsive grid utilities for event grid, gallery grid, why grid, contact grid, itinerary grid
  - Add mobile nav styles: `.nav-toggle`, `body.nav-open .site-nav` dropdown, hide `.nav-button` on mobile
  - Add utility class `.sr-only` for screen-reader-only labels
  - _Requirements: 17.1, 17.2, 18.1_

- [x] 2. Implement shared header/navigation on all pages
  - [x] 2.1 Write the shared `<header class="site-header">` HTML block with brand link, `.nav-toggle` hamburger button, `.site-nav` with five links (Home, Events, Gallery, About, Contact), and `.nav-button` "Book Your Spot"
    - Apply this header to: `index.html`, `pages/events.html`, `pages/event-detail.html`, `pages/about.html`, `pages/gallery.html`, `pages/contact.html`
    - Add inline active-link script at bottom of each page that sets `.is-active` and `aria-current="page"` on the matching nav link
    - _Requirements: 18.1, 18.2_
  - [ ]* 2.2 Write property test for active nav link detection (Property 18)
    - **Property 18: Active nav link matches current page**
    - **Validates: Requirements 18.2**
  - [ ]* 2.3 Write property test for nav links present on every page (Property 17)
    - **Property 17: Navigation bar present with all links on every page**
    - **Validates: Requirements 18.1**

- [x] 3. Implement mobile navigation toggle in script.js
  - Add `.nav-toggle` click handler that toggles `body.nav-open` and updates `aria-expanded`
  - _Requirements: 17.2, 17.3_
  - [ ]* 3.1 Write property test for mobile nav showing all links when open (Property 16)
    - **Property 16: Mobile nav shows all links when opened**
    - **Validates: Requirements 17.3**

- [x] 4. Implement homepage hero section (index.html)
  - Add `.hero.hero-slider` section with full-viewport background image (or `<video>` with `poster` fallback), tagline "Create. Relax. Experience Art in Nature.", and "Explore Events" CTA button linking to `pages/events.html`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 5. Implement homepage Featured Experiences section (index.html)
  - Add `.featured-experiences` section with three Event_Cards: Pottery Retreat, Painting Workshop, Weekend Art Escape
  - Each card links to `pages/events.html?type={type}` so the events page can pre-filter on load
  - Each card displays a representative image, title, and short description (≤ 2 lines)
  - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 5.1 Write property test for event card links carrying filter context (Property 1)
    - **Property 1: Event card links carry filter context**
    - **Validates: Requirements 2.3**

- [ ] 6. Implement homepage Upcoming Events section (index.html)
  - Add `.upcoming-events` section listing at least three events, each showing location, date, price, and a `.limited-tag` where `seatsLeft <= SEATS_THRESHOLD`
  - Each listing links to `pages/event-detail.html?id={id}`
  - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 6.1 Write property test for event listings displaying required metadata (Property 2)
    - **Property 2: Event listings display required metadata**
    - **Validates: Requirements 3.2**
  - [ ]* 6.2 Write property test for limited seats tag on low-availability events (Property 3)
    - **Property 3: Limited seats tag appears for low-availability events**
    - **Validates: Requirements 3.3, 14.1**
  - [ ]* 6.3 Write property test for event listing links navigating to detail page (Property 4)
    - **Property 4: Event listing links navigate to detail page**
    - **Validates: Requirements 3.4**

- [ ] 7. Implement homepage Why Choose Us section (index.html)
  - Add `.why-section` with four icon+text items: guided by artists, unique locations, beginner-friendly, community vibe
  - _Requirements: 4.1, 4.2_

- [ ] 8. Implement homepage Gallery / Moments section (index.html)
  - Add `.gallery-section` with a 6-photo responsive grid; add `data-lightbox` and `data-caption` attributes to each `<img>`
  - _Requirements: 5.1, 5.2_
  - [ ]* 8.1 Write property test for gallery lightbox opening for any photo (Property 5)
    - **Property 5: Gallery lightbox opens for any photo**
    - **Validates: Requirements 5.2, 11.4**

- [ ] 9. Implement homepage Testimonials section (index.html)
  - Add `.testimonials-section` with at least two testimonial cards, each showing quote, participant name, and event attended
  - _Requirements: 6.1, 6.2_
  - [ ]* 9.1 Write property test for testimonials containing all required fields (Property 6)
    - **Property 6: Testimonials contain all required fields**
    - **Validates: Requirements 6.2**

- [ ] 10. Implement homepage Before You Join, Gift, Newsletter, and CTA sections (index.html)
  - Add `.before-you-join` section with preparation tips list
  - Add `.gift-section` "Gift an Experience" with WhatsApp/Contact CTA
  - Add `.newsletter-section` with `<form class="newsletter-form">` (email input + submit button + `.form-feedback`)
  - Add `.cta-section` "Join the Next Retreat" heading and "Book Now" button linking to `pages/events.html`
  - _Requirements: 7.1, 7.2, 13.1, 15.1, 15.2, 16.1_

- [ ] 11. Checkpoint — homepage complete
  - Ensure all homepage sections render correctly and all links resolve. Ask the user if questions arise.

- [ ] 12. Implement Events page (pages/events.html)
  - [ ] 12.1 Add `.subpage-heading`, `.highlight-strip` ("Small batches | Expert guidance | All materials included"), and `.filter-bar` with three `<select>` elements (location, type, duration) and a Clear button
    - _Requirements: 8.1, 8.4_
  - [ ] 12.2 Add `.event-grid` with at least three Event_Cards, each with `data-type`, `data-location`, `data-duration` attributes, image, title, location, date, price, `.limited-tag` where applicable, and "View Details" button linking to `event-detail.html?id={id}`
    - _Requirements: 8.3, 14.1_
  - [ ] 12.3 Add `.no-results` paragraph (hidden by default) with message "No events match your filters. Try adjusting your search or clearing filters."
    - _Requirements: 8.5_
  - [ ]* 12.4 Write property test for event cards on events page containing required elements (Property 8)
    - **Property 8: Event cards on events page contain required elements**
    - **Validates: Requirements 8.3**

- [ ] 13. Implement events filter logic (pages/events-filter.js)
  - Create `pages/events-filter.js`; read filter `<select>` values on `change`, iterate `.event-card` elements, toggle `hidden` based on `data-type`/`data-location`/`data-duration` match; show `.no-results` when visible count is zero; handle URL query param `?type=` on page load to pre-apply filter from homepage card links; wire Clear button to reset all selects and re-apply
  - Link script from `pages/events.html`
  - _Requirements: 8.1, 8.2, 8.5_
  - [ ]* 13.1 Write property test for event filter hiding non-matching cards (Property 7)
    - **Property 7: Event filter hides non-matching cards**
    - **Validates: Requirements 8.2**
  - [ ]* 13.2 Write property test for no-results message visibility (Property 9)
    - **Property 9: No-results message shown when filter yields zero matches**
    - **Validates: Requirements 8.5**

- [ ] 14. Checkpoint — events page complete
  - Ensure filter interactions work and all cards display correctly. Ask the user if questions arise.

- [ ] 15. Implement Event Detail page (pages/event-detail.html)
  - [ ] 15.1 Create `pages/event-detail.html` with `.event-detail-hero` (title, location, price, booking CTA button), `.about-experience`, `.itinerary-section` (day-wise timeline), `.whats-included`, `.who-is-it-for`, `.event-gallery` (photo grid with `data-lightbox`), `.faq-section` (accordion with ≥ 3 Q&A), and `.sticky-cta` fixed bar (hidden initially)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [ ] 15.2 Create `pages/event-detail.js` using `IntersectionObserver` on the hero booking CTA; remove `hidden` from `.sticky-cta` when hero CTA leaves viewport, restore it when hero CTA re-enters
    - _Requirements: 9.8_

- [ ] 16. Implement About page (pages/about.html)
  - Add `.her-story` section, `.mission-section`, `.bts-photos` grid using Images/ assets, and `.personal-note` block
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 17. Implement Gallery page (pages/gallery.html)
  - [ ] 17.1 Add `.subpage-heading`, `.category-filter` buttons (All, Pottery, Painting, Retreat Moments), and `.gallery-grid` with images tagged with `data-category` and `data-lightbox`/`data-caption` attributes
    - _Requirements: 11.1, 11.3_
  - [ ] 17.2 Create `pages/gallery-filter.js`; toggle `.is-active` on category buttons, filter `.gallery-grid img` by `data-category` on button click without page reload; re-initialize lightbox image list from visible images after each filter change
    - _Requirements: 11.2_
  - [ ]* 17.3 Write property test for gallery category filter showing only matching photos (Property 10)
    - **Property 10: Gallery category filter shows only matching photos**
    - **Validates: Requirements 11.2**

- [ ] 18. Implement Lightbox in script.js
  - Inject `<div id="lightbox">` into the DOM on first use with prev/next/close buttons and `<figcaption>`
  - Build image list from all `[data-lightbox]` elements on the page; open lightbox on click, update `src`/caption, handle prev/next with wrap-around, hide prev/next when only one image
  - Add keyboard support: `Escape` closes, `ArrowLeft`/`ArrowRight` navigate; clicking backdrop closes; apply focus trap; set `aria-modal="true"`
  - _Requirements: 5.2, 11.4, 11.5_
  - [ ]* 18.1 Write property test for lightbox navigation cycling through all photos (Property 11)
    - **Property 11: Lightbox navigation cycles through all photos**
    - **Validates: Requirements 11.5**

- [ ] 19. Implement Contact page (pages/contact.html)
  - Add `.contact-hero`, `.contact-grid` with two columns: left has `<form class="contact-form">` (name, email, message fields with `.field-group`/`.field-error` structure and `.form-feedback`); right sidebar has WhatsApp_CTA button (`href="https://wa.me/…?text=…"`), Instagram link, and embedded `<iframe>` map
  - _Requirements: 12.1, 12.4, 12.5, 12.6_

- [ ] 20. Implement form validation (pages/contact-form.js)
  - Create `pages/contact-form.js`; validate contact form on submit: name non-empty, email matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, message non-empty; show per-field `.field-error` and add `.has-error` to `.field-group` on failure, focus first invalid field; show `.form-feedback` success and reset form on valid submit; clear field error on next `input` event
  - Also handle `.newsletter-form` submit: validate email pattern, show `.form-feedback` success or error accordingly
  - Link script from `pages/contact.html` and `index.html`
  - _Requirements: 12.2, 12.3, 16.2, 16.3_
  - [ ]* 20.1 Write property test for contact form confirmation on valid submission (Property 12)
    - **Property 12: Contact form confirmation shown on valid submission**
    - **Validates: Requirements 12.2**
  - [ ]* 20.2 Write property test for contact form validation errors identifying missing fields (Property 13)
    - **Property 13: Contact form validation errors identify missing fields**
    - **Validates: Requirements 12.3**
  - [ ]* 20.3 Write property test for newsletter confirmation on valid email (Property 14)
    - **Property 14: Newsletter confirmation shown on valid email**
    - **Validates: Requirements 16.2**
  - [ ]* 20.4 Write property test for newsletter validation error on invalid email (Property 15)
    - **Property 15: Newsletter validation error shown for invalid email**
    - **Validates: Requirements 16.3**

- [ ] 21. Final checkpoint — full site integration
  - Verify all pages load with correct header/footer, all internal links resolve, lightbox works on homepage and gallery, filter works on events page, sticky CTA works on event detail, forms validate correctly on contact and homepage. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** (minimum 100 iterations each)
- All JS files are plain ES modules or IIFE scripts — no build step required
- Images/ folder assets are used throughout; use existing filenames where available
