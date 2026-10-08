# Project Masonry Rebuild

## Old implementation

The project galleries were using a fragile combination of column layout, clipped cards, forced image presentation, and incorrect image dimension attributes. The gallery images had `height="4360"` in their markup even when the source files were ordinary landscape or portrait photographs. That created distorted aspect ratios, excessive vertical space, and unreliable tablet/iPad behavior. The previous card styling also used `overflow: hidden` and `object-fit: cover`, which could crop project photos.

## New implementation

All project pages use one CSS multi-column masonry system:

- `.vpg-masonry` is the shared container.
- `.vpg-masonry__item` is the column item and uses `break-inside: avoid`.
- Gallery images use `display: block`, `width: 100%`, and `height: auto`.
- Gallery markup no longer supplies invented width/height attributes, so each image keeps its real intrinsic aspect ratio.
- The gallery has no fixed height, grid row spans, absolute-positioned layout, third-party dependency, or gallery-container overflow clipping.
- `js/masonry_gallery.js` remains responsible only for the existing lightbox and broken-image fallback; it does not calculate masonry positions.

## Project pages changed

The shared gallery implementation is used by:

- `basement-bituminous-coating-waterproofing.html` — 8 images
- `bathroom-epoxy-grouting.html` — 5 images
- `bathroom-wet-area-waterproofing.html` — 5 images
- `concrete-repair-rehabilitation.html` — 8 images
- `internal-external-wall-waterproofing.html` — 5 images
- `pu-injection-grouting.html` — 8 images
- `tank-structure-epoxy-coating.html` — 8 images
- `terrace-cementitious.html` — 8 images
- `terrace-elastomeric-coating.html` — 23 images
- `water-tank-underground-sump-waterproofing.html` — 10 images

Total audited gallery items: 88.

## Files changed

- `css/terrace.css`
- `js/masonry_gallery.js` (layout responsibility documented; lightbox behavior retained)
- `basement-bituminous-coating-waterproofing.html`
- `bathroom-epoxy-grouting.html`
- `bathroom-wet-area-waterproofing.html`
- `concrete-repair-rehabilitation.html`
- `internal-external-wall-waterproofing.html`
- `pu-injection-grouting.html`
- `tank-structure-epoxy-coating.html`
- `terrace-cementitious.html`
- `terrace-elastomeric-coating.html`
- `water-tank-underground-sump-waterproofing.html`
- `PROJECT-MASONRY-REBUILD.md`

## Old masonry code removed

- Forced `height="4360"` image attributes from every affected gallery image.
- Gallery/card `overflow: hidden` clipping.
- Gallery image `object-fit: cover` cropping.
- The former fixed desktop-first masonry selector arrangement was replaced with one mobile-first shared rule set.
- No old grid-row/grid-span or absolute-positioned masonry engine remains.

## Responsive behavior

- Mobile, 320px–767px: 1 column.
- Tablet/iPad, 768px–1199px: 2 columns.
- Desktop, 1200px and above: 3 columns.
- Large desktop remains capped by the existing 1440px project content width; it does not create four tiny columns.
- The first item begins at the left edge of the existing project container.

## Validation

### Completed structural checks

- 10 project pages discovered and audited.
- All 88 gallery items use `.vpg-masonry__item`.
- All gallery images retain `alt` text.
- All referenced gallery assets exist locally.
- No gallery image retains the incorrect `height="4360"` attribute.
- No gallery item uses grid row spans or absolute positioning for layout.
- No fixed `.vpg-masonry` height or gallery-container `overflow: hidden` rule remains.
- No masonry package or dependency was added.
- CSS brace balance is valid and `js/masonry_gallery.js` parses successfully.

### Render-level viewport checks

The configured browser surface was unavailable in this environment, so live render checks were not marked as PASS. The following viewport checks remain to be run in a browser:

`320px`, `360px`, `375px`, `390px`, `412px`, `430px`, `480px`, `600px`, `768px`, `820px`, `834px`, `1024px`, `1200px`, `1280px`, `1366px`, `1440px`, `1536px`, and `1920px`.

The CSS rules are present for the required 1/2/3-column breakpoints, but final visual confirmation of image visibility, footer position, gallery height, and horizontal overflow should be performed in the project’s target browser matrix.
