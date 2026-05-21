# EmailJS setup (contact form)

The contact page (`pages/contact.html`) sends enquiries through [EmailJS](https://www.emailjs.com/) so messages arrive at **Kumkumarts37@gmail.com** (or whichever inbox you connect in EmailJS).

## 1. Create an EmailJS account

Sign up at [https://www.emailjs.com/](https://www.emailjs.com/).

## 2. Add an email service

1. Dashboard → **Email Services** → **Add New Service**.
2. Choose **Gmail** (or another provider) and connect the inbox that should receive enquiries (e.g. Kumkumarts37@gmail.com).
3. Note the **Service ID** (e.g. `service_xxxxxxx`).

## 3. Create an email template

1. Dashboard → **Email Templates** → **Create New Template**.
2. Set **To Email** to your connected address (or use the default from the service).
3. Use these **template variables** (names must match exactly):

| Variable       | Meaning                          |
|----------------|----------------------------------|
| `{{from_name}}` | Visitor’s full name            |
| `{{from_email}}` | Visitor’s email               |
| `{{reply_to}}` | Same as email (for Reply-To)   |
| `{{phone}}`    | Phone / WhatsApp                 |
| `{{interest}}` | What they’re interested in     |
| `{{message}}`  | Their message                    |

**Example subject**

```text
New enquiry from {{from_name}}
```

**Example content**

```text
You have a new message from the Kumkum Arts website.

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Interested in: {{interest}}

Message:
{{message}}
```

4. In the template settings, set **Reply To** to `{{reply_to}}` if your provider supports it, so you can hit “Reply” and answer the visitor directly.
5. Note the **Template ID** (e.g. `template_xxxxxxx`).

## 4. Get your public key

Dashboard → **Account** → **General** → **Public Key** (e.g. `xxxxxxxxxxxxxxx`).

## 5. Put IDs in the site config

Edit **`emailjs-config.js`** in the project root:

```javascript
window.EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};
```

You can start from **`emailjs-config.example.js`**: copy it to `emailjs-config.js` and replace the placeholders.

## 6. Production domain restrictions

In EmailJS, restrict which websites may call your API:

- **Account** → **Security** / **Email Services** → allowed domains / referrer restrictions (wording varies by dashboard version).
- Add your live domain (e.g. `https://www.yoursite.com`) and `http://localhost` for local testing.

## 7. Test

1. Open `pages/contact.html` via a local server (some browsers block `file://` for third-party scripts).
2. Submit the form with valid data.
3. Check the inbox and the EmailJS **History** / **Logs** if something fails.

## Files involved

| File                 | Role                                      |
|----------------------|-------------------------------------------|
| `emailjs-config.js`  | Your public key, service ID, template ID |
| `emailjs-contact.js` | Form handler; reads `window.EMAILJS_CONFIG` |
| `pages/contact.html` | Loads EmailJS SDK, then config, then handler |

If the form says the contact system could not load, the EmailJS script from the CDN failed (network, ad blocker, or CSP). Ask the visitor to use WhatsApp or email directly.
