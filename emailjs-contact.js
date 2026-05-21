/**
 * Contact form → EmailJS (https://www.emailjs.com/)
 *
 * Configuration: root `emailjs-config.js` sets `window.EMAILJS_CONFIG`.
 * Template variables must match your EmailJS template:
 *   {{name}}, {{email}}, {{phone}}, {{interest}}, {{message}}
 * (Set template “Reply To” to {{email}} in the dashboard if you want one-click reply.)
 *
 * @see docs/EMAILJS-SETUP.md
 */
(function () {
  var form = document.getElementById("contact-enquiry-form");
  var feedback = document.getElementById("contact-form-feedback");
  if (!form) return;

  var cfg =
    typeof window !== "undefined" && window.EMAILJS_CONFIG
      ? window.EMAILJS_CONFIG
      : null;

  function isPlaceholderConfig(c) {
    if (!c) return true;
    var pk = String(c.publicKey || "");
    var sid = String(c.serviceId || "");
    var tid = String(c.templateId || "");
    if (!pk || !sid || !tid) return true;
    if (/YOUR_|REPLACE|CHANGEME/i.test(pk + sid + tid)) return true;
    return false;
  }

  if (typeof emailjs === "undefined" || typeof emailjs.send !== "function") {
    if (feedback) {
      feedback.hidden = false;
      feedback.className = "form-feedback error";
      feedback.textContent =
        "Contact form could not load. Please refresh the page or message us on WhatsApp.";
    }
    return;
  }

  if (isPlaceholderConfig(cfg)) {
    if (feedback) {
      feedback.hidden = false;
      feedback.className = "form-feedback error";
      feedback.textContent =
        "Contact form is not configured yet. Please email us at Kumkumarts37@gmail.com or WhatsApp +91 90415 48576.";
    }
    console.warn(
      "EmailJS: set window.EMAILJS_CONFIG in emailjs-config.js (see docs/EMAILJS-SETUP.md)."
    );
    return;
  }

  emailjs.init({ publicKey: cfg.publicKey });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      if (feedback) {
        feedback.hidden = true;
        feedback.textContent = "";
        feedback.className = "form-feedback";
      }
      form.reportValidity();
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    var prevText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    if (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.className = "form-feedback";
    }

    var nameEl = form.querySelector("#full-name");
    var emailEl = form.querySelector("#email");
    var phoneEl = form.querySelector("#phone");
    var interestEl = form.querySelector("#interest");
    var messageEl = form.querySelector("#message");

    var name = nameEl ? nameEl.value.trim() : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var phone = phoneEl ? phoneEl.value.trim() : "";
    var interest = interestEl ? interestEl.value.trim() : "";
    var message = messageEl ? messageEl.value.trim() : "";

    emailjs
      .send(
        cfg.serviceId,
        cfg.templateId,
        {
          name: name,
          email: email,
          phone: phone,
          interest: interest,
          message: message,
        },
        cfg.publicKey
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          if (feedback) {
            feedback.hidden = false;
            feedback.className = "form-feedback success";
            feedback.textContent =
              "Thank you! We have received your enquiry. Our team will respond within 24 hours.";
          }
          form.reset();
        },
        function (error) {
          console.log("FAILED...", error);
          if (feedback) {
            feedback.hidden = false;
            feedback.className = "form-feedback error";
            feedback.textContent =
              "We could not send your message right now. Please try again in a moment or WhatsApp us at +91 90415 48576.";
          }
        }
      )
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevText;
        }
      });
  });
})();
