# Follow the Wild — website

Static site for the Follow the Wild nonprofit. Plain HTML, CSS and JavaScript, no build step.

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| What we do | `programs.html` |
| Get involved | `get-involved.html` |

Shared styles live in `assets/site.css`. `assets/site.js` adds the header, footer and menu, paints the landscape scenes and runs the sign-up form.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Before launch

- **Sign-up form** (`get-involved.html`): it's preview-only and doesn't save anything. Connect it to an email list service (Mailchimp, Buttondown, Formspree) by pointing the form at that service and removing the preview handler at the bottom of `assets/site.js`.
- **Photos**: web-sized copies live in `assets/photos/` (made from the originals at 2000px or 1400px). To swap one, drop a new file in that folder and change the `src` on the matching `<img class="scene">`. Use `style="object-position:x% y%"` to choose which part of the photo stays in frame on phones.
- **Donations**: add a Donate button only once 501(c)(3) status comes through.
