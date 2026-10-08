# Vimana project gallery audit

Updated: 2026-10-08

## Scope

The project-detail galleries are implemented as one shared component:

- Section: `.vpg-section`
- Container: `.vpg-container`
- Gallery: `.vpg-masonry`
- Item: `.vpg-masonry__item.vpg-item`
- Shared styles: `css/terrace.css`
- Shared lightbox behavior and broken-image fallback: `js/masonry_gallery.js`

The standalone `project.html` landing page uses the separate `.vmprj-grid` card component and is not a masonry gallery.

## Before

- Gallery styles were present, but the responsive breakpoints allowed two columns down to 431px.
- The gallery section and card styles used overflow/crop-oriented behavior, including `object-fit: cover` on gallery images and hover scaling.
- Gallery items did not consistently expose intrinsic image dimensions or asynchronous decoding.
- Some `data-image` values differed from the visible thumbnail source, which could open the wrong image in the lightbox.
- Gallery markup used `.vpg-item` without the semantic `.vpg-masonry__item` name.

## Implementation

- CSS columns are used for natural-height masonry packing; no JavaScript layout calculation is required.
- 320–767px: one column.
- 768–1199px: two columns.
- 1200px and wider: three columns.
- Section side padding is 16px on mobile, 24px on tablet, and 32px on desktop.
- Images remain `width: 100%`, `height: auto`, and preserve their intrinsic aspect ratio.
- Gallery images use `loading="lazy"`, `decoding="async"`, and intrinsic `width`/`height` attributes.
- Gallery layout has no fixed height, max-height, absolute-positioned items, negative margins, or parent overflow clipping.
- Missing thumbnails receive a visible “Project image unavailable” fallback instead of leaving an empty broken card.

## Updated pages

| Page | Gallery items |
| --- | ---: |
| `basement-bituminous-coating-waterproofing.html` | 8 |
| `bathroom-epoxy-grouting.html` | 5 |
| `bathroom-wet-area-waterproofing.html` | 5 |
| `concrete-repair-rehabilitation.html` | 8 |
| `internal-external-wall-waterproofing.html` | 5 |
| `pu-injection-grouting.html` | 8 |
| `tank-structure-epoxy-coating.html` | 8 |
| `terrace-cementitious.html` | 8 |
| `terrace-elastomeric-coating.html` | 23 |
| `water-tank-underground-sump-waterproofing.html` | 10 |

## Validation

- `check-paths.mjs`: **PASS** — 1,905 references scanned; no missing files, case mismatches, outside-root references, public-path references, or broken anchors.
- Gallery markup audit: **PASS** — all 10 pages use `.vpg-section`, all items use `.vpg-masonry__item.vpg-item`, thumbnails have lazy loading/async decoding/intrinsic dimensions, and `data-image` matches the visible image source.
- Width contract checked in CSS for: 320, 360, 375, 390, 412, 430, 480, 540, 600, 768, 820, 834, 1024, 1180, 1280, 1366, 1440, 1536, and 1920px.
- Live browser screenshot capture was not available in this workspace, so visual browser results remain a manual follow-up after deployment or when browser automation is connected.

