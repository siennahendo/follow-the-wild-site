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

The October 17, 2026 local revision focuses on wildlife content made for creator platforms and younger audiences. Filmmakers and photographers are included when bringing their work into these formats. The mission is to make the next generation care about wildlife and want to get outside. The intended mechanism is funding projects made by creators together. Membership, application rules, funding amounts and schedules are undecided. The draft uses an interest list and clearly labels concept projects as illustrative; it does not invent signed-up creators. Earlier classroom, grantmaking, science and conservation-program commitments have been removed from the draft.

The headline rotates through Follow, Share, Stream, Watch, then back to Follow, with The Wild remaining orange. Motion respects `prefers-reduced-motion`; the footer also has a pause control. Charts animate into view and have replay controls. Essential content and chart data remain readable without JavaScript.

## Before public launch

- The donation flow is a local demonstration with preset/custom USD amounts and a preview dialog. It has no payment processor, collects no donor information, and records no pledges. Connect a chosen donation service only after authorization.
- The interest form is live (turned on 2026-10-18). It posts to FormSubmit, which emails sienna@mike-mcgovern.com with a copy to zander@mike-mcgovern.com. FormSubmit only starts delivering after the first submission's one-time activation email is confirmed. To pause it, set `data-delivery="pending"` on `#interest-form` in `scripts/build_preview.py` and rebuild.
- Review mission wording and collaboration ideas with Michael and Sienna.
- Confirm the legal nonprofit designation before adding tax-exemption or donation claims.
- The research page links primary sources and labels dates, populations and units. The YouTube line chart compares July snapshots, not annual averages. Recheck any future data updates against those definitions.
- Review social sharing artwork in `assets/share.jpg` before release.
- GitHub Pages currently publishes `main` to the domain in `CNAME`. Pushing or merging to that branch may change the live site. This revision is shared for review on `codex/creator-community-preview`. Do not merge to `main` or deploy to production without approval.
