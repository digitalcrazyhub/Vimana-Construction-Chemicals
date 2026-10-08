# Changelog

## Frontend audit and rebuild — 8 October 2026

### Added

- `robots.txt` with the production sitemap location.
- Consistent canonical, description, Open Graph, and Twitter metadata on all 20 public HTML documents.
- Shared focus-visible styles, responsive layout overrides, fluid hero sizing, touch-target sizing, and reduced-motion handling.
- Keyboard-safe mobile navigation with `aria-expanded`, `aria-hidden`, Escape-to-close, outside-click close, focus return, focus containment, submenu state, and body scroll locking.
- Frontend-only contact form validation with clean field names (`name`, `email`, `phone`, `service`, `message`) and an explicit future `data-endpoint` integration point.

### Changed

- Flattened the deployment tree so all page documents, `css/`, `js/`, and `assets/` directories are directly uploadable to Hostinger `public_html`; no public URL contains `/public/`.
- Simplified Apache rules to serve the flat files directly and redirect legacy `/public/` and singular service/product URLs.
- Standardized production metadata on `https://vimanaconstructionchemicals.com`.
- Normalized every telephone link to `+91 78454 01301`.
- Replaced the footer Google Maps Sitemap URL with `/sitemap.xml`.
- Replaced fixed home hero heights with fluid `clamp()`/`svh` sizing and made card grids adapt with `auto-fit`/`minmax()`.
- Replaced the home slider and shared navigation scripts with null-safe, reduced-motion-aware vanilla JavaScript.
- Made project-detail counts start at `00` and be populated from the rendered gallery item count.
- Replaced repeated process-card inline styles with reusable CSS classes.

### Removed or retired

- The runtime `path-fix.js` mutation-observer URL rewriter and unused `common.js` component loader; both were empty/unreferenced and were deleted.
- The nonexistent reCAPTCHA dependency and hard-coded `/api/contact.php` submission path from the contact page.
- Verified legacy `vmn-*` hero blocks from the project, team, and terrace stylesheets.
- Verified legacy awards hero CSS and unused contact toast styles.
- Duplicate About and PU Injection Grouting titles, duplicate Contact descriptions, duplicate Lucide loading on the team page, and misleading hard-coded project count text.

### Fixed

- Broken path assumptions between root routes and `public/page` source files.
- Undefined shared `--transition` usage by introducing central transition/navigation tokens.
- Missing Open Graph/Twitter metadata across previously incomplete pages.
- Missing alt text on award SVG data-image cards.
- Contact form error semantics with `aria-describedby`, `role="alert"`, `aria-invalid`, and focus to the first invalid field.
- Mobile menu accessibility and interaction behavior.
- Missing product image references in the catalog, including the unavailable 544 grout filenames and Zinc Rich Primer case mismatch.

### Verification

- All JavaScript files compile successfully with the JavaScript parser.
- All clean HTML routes, `sitemap.xml`, and `robots.txt` returned HTTP 200 in the local static preview.
- All HTML-referenced CSS/JS/image resources returned HTTP 200 in the local preview.
- All CSS `url()` assets returned HTTP 200 in the local preview.
- Duplicate IDs: none found.
- Images without `alt`: none found.
- Metadata: one title, one description, one viewport, and one canonical per public HTML page.
- `check-paths.mjs`: 1,897 references checked; 0 missing, 0 case mismatches, 0 outside-root paths, 0 `/public/` paths, and 0 broken fragments.
- Five byte-identical unused Bitufix duplicates removed; 19 other unreferenced assets remain documented in `PATH-AUDIT.md` for an intentional future cleanup decision.
- Live browser screenshot/viewport testing could not be completed because no browser instance was connected in the environment; the required widths remain a final manual/browser pass before deployment.
