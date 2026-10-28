# Follow the Wild website

Static HTML, CSS and JavaScript. No build step or package installation required.

## Local preview

From this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/ in a browser.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Creator community invitation and rotating headline |
| `about.html` | Mission and approach |
| `programs.html` | Creator-platform vision and illustrative collaboration concepts |
| `why-it-matters.html` | Sourced, animated charts about audience habits |
| `get-involved.html` | Creator interest list prototype; not a membership or funding application |
| `support.html` | Funding vision and local donation demo |

Shared styles and interactions are in `assets/site.css`, `assets/organic.css` and `assets/site.js`. The page generator and research content are in `scripts/`; run `python3 scripts/build_preview.py` after editing them. Existing photography remains in `assets/photos/`.

## Current review scope

The October 28, 2026 revision reflects the nonprofit sync: education and public engagement through wildlife and nature storytelling, for audiences of all ages. The planned first fellowship combines small project grants with mentoring; amounts, dates, eligibility and participants remain unannounced. Home introduces the purpose, About explains the role, Our work describes the proposed programmes and reporting, Social media data retains the sourced research, For creators collects introductions, and Support explains philanthropic and corporate opportunities. No impact totals or partner commitments are claimed.

## Before public launch

- The donation flow is a local demonstration with preset/custom USD amounts and a preview dialog. It has no payment processor, collects no donor information, and records no pledges. Connect a chosen donation service only after authorization.
- The interest form is live (turned on 2026-10-18). It posts to FormSubmit, which emails sienna@mike-mcgovern.com with a copy to zander@mike-mcgovern.com. FormSubmit only starts delivering after the first submission's one-time activation email is confirmed. To pause it, set `data-delivery="pending"` on `#interest-form` in `scripts/build_preview.py` and rebuild.
- Mission wording and programme details reflect the October 28 call; confirm legal-purpose wording with counsel.
- Confirm the legal nonprofit designation before adding tax-exemption or donation claims.
- The research page links primary sources and labels dates, populations and units. The YouTube line chart compares July snapshots, not annual averages. Recheck any future data updates against those definitions.
- Review social sharing artwork in `assets/share.jpg` before release.
- GitHub Pages currently publishes `main` to the domain in `CNAME`. Pushing or merging to that branch may change the live site. Publish only changes authorized by the site owner; the October 28 website update was requested by Sienna.
