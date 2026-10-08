# Vimana Construction Chemicals — Frontend Audit

## Audit scope

Baseline audit completed before the rebuild on 8 October 2026. The repository was scanned recursively, excluding Git internals, including all 20 HTML pages, 12 CSS files, 12 JavaScript files, `.htaccess`, `sitemap.xml`, and the image library.

## Repository structure

- `index.html` is the home page and 19 additional HTML documents now sit beside it at the deployment root.
- `css/` contains shared navigation/footer styles plus home, page-banner, service, product, project, about, contact, team, awards, terrace, and floating-action styles.
- `js/` contains separate home, navigation/footer, about, contact, product, service, project/gallery, and reviews scripts; obsolete path-fixing/common placeholders are no longer referenced.
- `assets/` contains logos, hero images, industry images, product images, and project galleries. The flattened deployment contains 295 files, including 244 bitmap assets and the path validator.
- `.htaccess` keeps only legacy `/public/` and singular service/product redirects; clean HTML files are served directly from `public_html`.
- `sitemap.xml` lists the public routes under `vimanaconstructionchemicals.com`.
- No `package.json`, build manifest, framework entry point, or server runtime was found. The effective runtime is static HTML/CSS/vanilla JavaScript with CDN-hosted icon/font dependencies.

## Architecture and dependency map

### Shared runtime

- Home: `css/styles.css`, `css/nav-footer.css`, `css/float-btn.css`; `js/script.js`, `js/review.js`, `js/nav-footer.js`.
- Company pages: `about.css` or `team.css`, `page-banner.css`, shared navigation/footer/floating-action CSS; `about.js` and `nav-footer.js`.
- Contact: `css/contact.css`, `js/contact.js`, shared navigation/footer/floating-action CSS, and no fabricated backend/reCAPTCHA dependency.
- Product/service indexes: respective page CSS and JavaScript plus shared navigation/footer.
- Project index/details: `project.css`/`terrace.css`, `masonry_gallery.js` and/or `project.js`, plus shared navigation/footer.

### External dependencies

- Plus Jakarta Sans and Manrope are loaded from Google Fonts.
- Lucide icons are loaded from `unpkg.com` or jsDelivr, inconsistently across pages.
- Contact loads Google reCAPTCHA, but no backend submission endpoint is present in the repository.
- No framework, package manager dependency, or server-side application is required by the inspected code.

## Baseline issues found

### Routing and hosting

- Root documents link to `/services.html`, `/products.html`, and other clean routes while the source documents live under `public/page/`; the site compensates with `.htaccess` and `path-fix.js`.
- `path-fix.js` installs a whole-document `MutationObserver` to rewrite paths at runtime. This is unnecessary for a static Hostinger deployment and can hide broken source paths.
- Page-level CSS/JS references mix `../`, `/`, and relative URLs. This makes local previews and direct page requests fragile.
- `.htaccess` is more complex than necessary and has no explicit fallback or canonical handling for direct `public/page/` asset context.

### HTML and SEO

- `public/page/about.html` contains two `<title>` elements.
- `public/page/contact.html` contains two description meta tags.
- Most page templates omit viewport/canonical/Open Graph completeness or use inconsistent metadata.
- The home page uses the Vercel preview domain in canonical and social metadata while `sitemap.xml` uses the production domain. The production domain is treated as `https://vimanaconstructionchemicals.com` for the rebuild.
- Several internal links point to routes that only work after runtime path rewriting.
- `index.html` has large commented-out production markup that should not ship.
- The footer Sitemap link points to a Google Maps URL instead of `/sitemap.xml`.
- Telephone links use both `+917845401301`, `+917845404310`, and `+91917845401301`; this is inconsistent with the displayed primary number.
- Some templates use duplicate or inconsistent CDN sources for Lucide and duplicate Lucide script tags.

### CSS

- `styles.css` defines substantial home-page styling but still references an undefined `var(--transition)`.
- The home hero uses fixed `height`/`min-height` values up to 700px and the hero heading uses a fixed minimum height, increasing mobile whitespace and clipping risk.
- Grid rules are repeated and override each other (`cards-grid`/`grid-four`), with desktop-first fixed column counts.
- Shared navigation styles and state names (`vm-scrolled`, mobile open states) are split across multiple files without one token system.
- `project.css`, `terrace.css`, and `awards.css` contain legacy/duplicate hero systems that need classification against live page markup before removal.
- The reported unused CSS selectors require repository-wide checks because many classes are generated or state-driven by JavaScript.

### JavaScript

- `path-fix.js` uses a broad `MutationObserver` for normal URL resolution.
- Navigation has most of the intended state handling but lacks robust focus management and a complete reduced-motion strategy.
- Home slider autoplay always starts, including when the user prefers reduced motion; pause-on-hover/focus is missing.
- Home and shared scripts each initialize icons/year/top controls, creating duplicate responsibilities.
- Contact/product/project scripts are page-specific and must remain null-safe when loaded only on their target pages.

### Accessibility and responsive risks

- Mobile navigation semantics are present but need consistent `aria-controls`, `aria-expanded`, focus return, Escape handling, and body-scroll locking.
- Several interactive controls rely on icon-only content and inconsistent labels.
- Mobile hero and multi-column card layouts need verification from 320px through desktop widths.
- Forms need a clean frontend-only status model, field names, required states, and accessible error/status handling.

## Planned rebuild architecture

- Keep the static HTML architecture and existing business content.
- Use root clean URLs backed by the files directly deployed to `public_html`.
- Remove runtime path rewriting and keep all public resource paths under `/css`, `/js`, and `/assets`.
- Consolidate shared design tokens, focus styles, responsive layout primitives, and navigation behavior.
- Keep page-specific CSS/JS only where repository usage proves it is needed.
- Preserve the current project/product imagery and legal/company content; change only layout, metadata, paths, and obvious content inconsistencies.

## Verification status

This is the baseline report. Responsive browser verification, link validation, duplicate metadata checks, and the post-rebuild unused-CSS review are recorded below as the implementation proceeds.

### Remaining warnings at baseline

- Browser automation was not yet run at the required matrix.
- The production email/domain details were not externally verified; existing repository values are preserved unless internally inconsistent.
- No backend form endpoint exists, so form submission remains frontend-only.

## Final audit after rebuild

### Architecture and hosting

- The site remains a static HTML/CSS/vanilla-JS deployment with no Node server, framework runtime, package manager, or build step.
- Clean public routes are served directly from the flattened Hostinger-ready root; `.htaccess` contains compatibility redirects only.
- All HTML asset/script references now use `/css`, `/js`, and `/assets`. No production source reference contains `/public/`.
- Obsolete `path-fix.js` and `common.js` placeholders were removed after confirming they were empty and unreferenced.

### Metadata and links

- 20 public HTML documents now have exactly one title, description, viewport, canonical, Open Graph set, and Twitter card set.
- All production metadata uses `https://vimanaconstructionchemicals.com`; no Vercel preview-domain reference remains.
- Local route/resource validation found no missing HTML/CSS/JS/image references.
- All phone links use `tel:+917845401301`; the footer Sitemap link is `/sitemap.xml`.
- `sitemap.xml` contains 20 valid production URLs and `robots.txt` points crawlers to it.

### CSS cleanup and classification

- Live contact/map classes were retained after checking all page markup.
- Dynamic state classes retained: `.vm-scrolled`, `.show`, `.contact-form__group--error`, `.contact-form__btn--loading`, `.js-scroll-*`, and generated `vmprj-*` project classes.
- Verified legacy hero systems were removed from `awards.css`, `terrace.css`, `project.css`, and the unused responsive remnants in `team.css`.
- The undefined generic transition token is now defined centrally, and shared responsive overrides use fluid sizing rather than fixed mobile widths/heights.
- Verified unused contact toast CSS was removed after the toast runtime was retired.

### Accessibility and responsive work

- Mobile navigation now updates accessible state, traps focus while open, closes on Escape/outside click/link selection, returns focus, and locks body scrolling.
- Interactive controls use visible focus styles and minimum touch-target sizing.
- Contact fields have clean names, labels, required states, described errors, invalid states, and frontend-only endpoint readiness.
- Home slider, reveal effects, counters, about/awards motion, and shared scroll behavior respect reduced-motion preferences.
- Home hero and card grids use `clamp()`, `svh`, `auto-fit`, and `minmax()`-based layout rules.

### Automated verification after rebuild

- JavaScript parser check: passed for all project scripts.
- CSS brace/parenthesis integrity check: passed for all project stylesheets.
- Duplicate IDs: 0.
- Images missing `alt`: 0.
- Clean route checks: all public routes, sitemap, and robots returned HTTP 200 in the local static preview.
- HTML-referenced resources and CSS `url()` resources: 0 missing.
- `check-paths.mjs`: passed with 1,897 scanned references, 0 missing targets, 0 case mismatches, 0 outside-root targets, 0 `/public/` production references, and 0 broken fragments.
- Five byte-identical, unreferenced top-level Bitufix duplicates were removed; referenced copies remain under `assets/product_img/`. Nineteen other assets are retained and listed as currently unused by static reference analysis in `PATH-AUDIT.md` because some product data is intentionally catalog-driven.
- Live browser viewport/screenshot checks: unavailable because no browser instance was connected; perform the final 320–1920px matrix in a connected Chromium/browser before publishing.

### Dependency report

| Dependency | Status |
| --- | --- |
| React / ReactDOM | Not used |
| Vue / Angular / Svelte / Next.js | Not used |
| Tailwind / Bootstrap / Material UI | Not used |
| jQuery / Alpine | Not used |
| Node.js server or build runtime | Not required |
| Lucide CDN | Used by existing icon markup; optional future inline-SVG replacement |
| Google Fonts CDN | Used for Plus Jakarta Sans/Manrope; can be self-hosted later for stricter performance control |
| Google reCAPTCHA | Removed; no backend endpoint exists yet |
