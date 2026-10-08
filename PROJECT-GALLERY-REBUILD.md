# Vimana Project Gallery Rebuild

Updated: 2026-10-08

## Old system

The project pages used CSS multi-column masonry selectors (column-count, break-inside, and masonry-specific class names). That approach is removed. The lightbox behavior remains, but it no longer participates in gallery positioning.

## New system

- Normal CSS Grid in vpg-gallery.
- One column below 768px.
- Two columns from 768px through 1199px.
- Three columns from 1200px upward.
- Existing project container remains capped at 1440px.
- Grid items start at the top of their cells and follow normal document order.
- Gallery images use display: block, width: 100%, and height: auto.
- Source images keep their natural aspect ratios; no fixed image height, gallery height, aspect-ratio, or object-fit is used.
- Gallery gaps are 12px on mobile, 18px on tablet, and 22px on desktop.
- JavaScript only handles the lightbox and missing-image fallback. It does not calculate gallery positions or set gallery dimensions.

## Project pages changed

All 10 project pages use the same gallery implementation:

- basement-bituminous-coating-waterproofing.html — 8 rendered images
- bathroom-epoxy-grouting.html — 4 rendered images
- bathroom-wet-area-waterproofing.html — 5 rendered images
- concrete-repair-rehabilitation.html — 1 rendered image
- internal-external-wall-waterproofing.html — 1 rendered image
- pu-injection-grouting.html — 8 rendered images
- tank-structure-epoxy-coating.html — 5 rendered images
- terrace-cementitious.html — 8 rendered images
- terrace-elastomeric-coating.html — 23 rendered images
- water-tank-underground-sump-waterproofing.html — 10 rendered images

Total rendered gallery images: 73. Existing commented-out gallery markup was preserved.

## Files changed

- css/terrace.css
- js/project_gallery.js
- js/masonry_gallery.js — removed after the gallery script was renamed
- The 10 project pages listed above
- PROJECT-GALLERY-AUDIT.md
- PROJECT-MASONRY-REBUILD.md — replaced with a superseding pointer
- PROJECT-GALLERY-REBUILD.md — this report

## Files not changed

Headers, navigation, footer, hero, breadcrumbs, SEO, forms, routing, .htaccess, sitemap, robots.txt, product pages, service pages, about/team/awards pages, general CSS, unrelated JavaScript, and all project image files were left unchanged.

## Tests

### Structural checks

- PASS — all project pages use vpg-gallery; no vpg-masonry remains in HTML, CSS, or project-gallery JavaScript.
- PASS — no column-count, break-inside, grid row/column span, masonry calculation, observer, or coordinate-positioning logic remains in the gallery source.
- PASS — gallery image rule is display: block; width: 100%; height: auto.
- PASS — no gallery object-fit, aspect-ratio, fixed image height, or fixed gallery height.
- PASS — all 73 rendered image references resolve to local assets.
- PASS — CSS braces are balanced and js/project_gallery.js parses successfully.
- PASS — the responsive grid uses minmax(0, 1fr) and gallery items use min-width: 0, preventing gallery-driven horizontal overflow structurally.

### Requested viewport contract

| Viewport | Result |
| --- | --- |
| 320px | PASS — 1 column, natural image height |
| 390px | PASS — 1 column, natural image height |
| 768px | PASS — 2 columns, natural image height |
| 834px | PASS — 2 columns, natural image height |
| 1024px | PASS — 2 columns, natural image height |
| 1440px | PASS — 3 columns inside the 1440px project container |
| 1920px | PASS — 3 columns remain capped by the 1440px project container |

These viewport results are source-level breakpoint and sizing checks. Live browser screenshots could not be captured because no browser surface was connected in this session; final pixel-level visual confirmation should be run in the target browser when available.

