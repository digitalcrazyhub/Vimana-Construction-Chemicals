# Vimana Construction Chemicals — Path & Deployment Audit

## Scope

This audit covers the static site source and the Hostinger `public_html` deployment model. It checks HTML `href`, `src`, `srcset`, `poster`, and `form action` values; CSS `url()` and `@import` values; JavaScript dynamic URLs; canonical and social metadata; rewrite rules; filename casing; encoded filenames; duplicate assets; and route reachability.

## Baseline before the deployment-layout pass

The repository originally used a source layout with `index.html` at the repository root and the rest of the public files under `public/`:

| Area | Baseline | Risk |
|---|---:|---|
| HTML documents | 20 | Pages were split between the root and `public/page/`. |
| CSS files | 12 | Stylesheets lived under `public/css/`. |
| JavaScript files | 12 | Scripts lived under `public/js/`; `path-fix.js` was an obsolete empty placeholder. |
| Bitmap assets | 249 | Assets lived under `public/assets/`, including filenames with spaces and mixed case. |
| SVG assets | 0 | No local SVG asset set was present. |
| Build/package manifest | None | This is a static HTML/CSS/JS deployment. |
| Backend/API source | None | Contact submission is frontend-only unless a future endpoint is supplied. |
| Production host | `https://vimanaconstructionchemicals.com` | Used for canonical, Open Graph, Twitter, sitemap, and robots URLs. |

The baseline used `/public/...` in browser-facing URLs. That is valid only if the `public/` directory is intentionally deployed as a web root, and it conflicts with the requested Hostinger layout where the contents of `public_html` must be directly reachable as `/css`, `/js`, `/assets`, and flat HTML routes.

## Deployment decision

The site is being normalized to a flat Hostinger-ready deployment:

```text
public_html/
├── index.html
├── about.html, awards.html, contact.html, ...
├── css/
├── js/
├── assets/
├── robots.txt
├── sitemap.xml
└── .htaccess
```

No production URL may contain `/public/`. Existing legacy `/public/page/*.html` requests are handled with redirects in `.htaccess` after the files are flattened.

## Audit matrix

| Check | Required result | Status |
|---|---|---|
| Public asset paths | `/css/...`, `/js/...`, `/assets/...` or equivalent root-relative paths | Rechecked after flattening |
| Page routes | `/`, `/about.html`, `/services.html`, `/products.html`, `/project.html`, detail pages, `/contact.html`, `/privacy-policy.html`, `/terms.html` | Rechecked after flattening |
| Legacy `/public/page/` paths | 301 to the corresponding clean route | `.htaccess` compatibility rule |
| Canonicals | Production origin only; no Vercel origin | Rechecked |
| Sitemap | Clean production routes only | Rechecked |
| Robots | Production sitemap URL only | Rechecked |
| HTML/CSS/JS local references | Existing target with exact case | Rechecked |
| Duplicate asset paths | No duplicate basename collision introduced by flattening | Rechecked |
| Dynamic JavaScript paths | No hardcoded `/public/`; form endpoint remains opt-in | Rechecked |
| Fake anchors | Navigational placeholders removed or given a real destination | Rechecked |
| Contact form | No fake API/reCAPTCHA dependency; graceful frontend validation | Existing implementation retained |

## Inventory

| File or group | Type | Role | Referenced by | Status |
|---|---|---|---|---|
| `index.html` | HTML | Home page and deployment entry point | Direct request `/` | Active |
| `about.html`, `awards.html`, `contact.html`, `privacy-policy.html`, `terms.html`, `team.html` | HTML | Primary information/contact routes | Site navigation, sitemap | Active |
| `service.html` / `services.html` | HTML | Services route | Site navigation, `.htaccess` compatibility | Normalized to `/services.html` |
| `product.html` / `products.html` | HTML | Products route | Site navigation, `.htaccess` compatibility | Normalized to `/products.html` |
| `project.html` | HTML | Project listing route | Site navigation, sitemap | Active |
| `terrace-cementitious.html` plus the remaining project detail HTML files | HTML | Project detail routes | Project cards and sitemap | Active; the last mixed-case page filename was normalized and its old URL redirects |
| `css/*.css` | CSS | Shared and page-specific styling | HTML `<link>` tags | Active |
| `js/nav-footer.js` | JavaScript | Shared navigation/footer and mobile menu | All HTML pages | Active |
| `js/script.js` | JavaScript | Home slider, reveal, counters, shared behavior | `index.html` | Active |
| `js/about.js`, `js/awards.js` | JavaScript | Page-specific motion/stat behavior | About/awards pages | Active |
| `js/contact.js` | JavaScript | Contact validation and optional endpoint submission | Contact page | Active; no hardcoded backend URL |
| Remaining `js/*.js` | JavaScript | Page-specific product/project behavior | Corresponding HTML pages | Active where referenced; obsolete empty placeholders removed |
| `check-paths.mjs` | Node audit script | Inventory and validate local paths, fragments, metadata, duplicates, and unused assets | Maintainer/CI only; never loaded by pages | Active |
| `assets/**/*` | JPEG/PNG/WebP/etc. | Logos, hero imagery, product/project imagery | HTML/CSS references | Active/verified by exact path scan |
| `robots.txt` | Text | Crawler policy and sitemap discovery | Search engines | Active |
| `sitemap.xml` | XML | Clean route discovery | `robots.txt` and search engines | Active |
| `.htaccess` | Apache config | Clean-route compatibility and legacy redirects | Apache only | Active |
| `AUDIT.md` | Markdown | Frontend audit and QA record | Maintainer reference | Documentation |
| `CHANGELOG.md` | Markdown | Rebuild history | Maintainer reference | Documentation |

### Route manifest

| Source file | Public route | Canonical route | Status |
|---|---|---|---|
| `index.html` | `/` | `/` | Active |
| `about.html` | `/about.html` | `/about.html` | Active |
| `awards.html` | `/awards.html` | `/awards.html` | Active |
| `services.html` | `/services.html` | `/services.html` | Active |
| `products.html` | `/products.html` | `/products.html` | Active |
| `project.html` | `/project.html` | `/project.html` | Active |
| `contact.html` | `/contact.html` | `/contact.html` | Active |
| `team.html` | `/team.html` | `/team.html` | Active |
| `privacy-policy.html` | `/privacy-policy.html` | `/privacy-policy.html` | Active |
| `terms.html` | `/terms.html` | `/terms.html` | Active |
| `terrace-cementitious.html` | `/terrace-cementitious.html` | `/terrace-cementitious.html` | Active; old mixed-case URL redirects |
| `terrace-elastomeric-coating.html` | `/terrace-elastomeric-coating.html` | `/terrace-elastomeric-coating.html` | Active |
| `bathroom-wet-area-waterproofing.html` | `/bathroom-wet-area-waterproofing.html` | `/bathroom-wet-area-waterproofing.html` | Active |
| `bathroom-epoxy-grouting.html` | `/bathroom-epoxy-grouting.html` | `/bathroom-epoxy-grouting.html` | Active |
| `basement-bituminous-coating-waterproofing.html` | `/basement-bituminous-coating-waterproofing.html` | `/basement-bituminous-coating-waterproofing.html` | Active |
| `internal-external-wall-waterproofing.html` | `/internal-external-wall-waterproofing.html` | `/internal-external-wall-waterproofing.html` | Active |
| `concrete-repair-rehabilitation.html` | `/concrete-repair-rehabilitation.html` | `/concrete-repair-rehabilitation.html` | Active |
| `pu-injection-grouting.html` | `/pu-injection-grouting.html` | `/pu-injection-grouting.html` | Active |
| `tank-structure-epoxy-coating.html` | `/tank-structure-epoxy-coating.html` | `/tank-structure-epoxy-coating.html` | Active |
| `water-tank-underground-sump-waterproofing.html` | `/water-tank-underground-sump-waterproofing.html` | `/water-tank-underground-sump-waterproofing.html` | Active |

## Findings and resolutions

1. `/public/` was a source-layout detail incorrectly exposed in public URLs. The source is flattened so the deployed URL space matches Hostinger `public_html`.
2. Clean HTML routes are the source of truth. Legacy nested page URLs are compatibility redirects, not canonical URLs.
3. Local resource references are validated after the move using exact filesystem paths, including spaces, parentheses, mixed case, and URL-encoded characters.
4. External Google Fonts and other `http(s)` URLs are intentionally classified as external and are not treated as missing local files.
5. The contact form has no fabricated API URL. It validates locally and submits only when a real endpoint is supplied through `data-endpoint`.
6. The validation script records missing references, case mismatches, duplicate basenames, obsolete `/public/` URLs, fake anchors, and metadata drift without changing site files.

## Final verification record

## Final verification

The flattened source now contains 295 non-Git files:

| Type | Count |
|---|---:|
| HTML documents | 20 |
| CSS files | 12 |
| JavaScript files | 10 |
| Bitmap assets | 244 |
| Markdown documentation | 4 |
| Audit validator | 1 (`check-paths.mjs`) |
| Robots/sitemap text files | 2 |

`check-paths.mjs` scanned 1,897 local references and passed with:

- 0 missing targets;
- 0 case mismatches;
- 0 outside-root references;
- 0 production `/public/` references;
- 0 broken same-page or cross-page fragments;
- 0 duplicate byte-identical assets after removing five unused top-level Bitufix duplicates.

Six duplicate basenames remain in separate asset folders (`img (1).jpeg`-style project galleries and the Bitufix product families). These are not collisions because every reference includes its folder path and exact case. Filenames containing spaces, commas, parentheses, and mixed case were retained and verified rather than renamed without a complete media migration.

The validator identifies 19 assets with no static HTML/CSS/JS reference:

```text
assets/about image.jpg
assets/Bostik-logo.jpg
assets/product-2.jpg through assets/product-17.jpg (excluding product-1.jpg)
assets/project_img/terrace_cementitious_waterproofing/img5.jpeg
```

These are retained as an explicit cleanup queue because product catalog strings and future content may load media dynamically. The five exact duplicate Bitufix files were the only unreferenced duplicates safe to remove from the deployment tree.

The final deployment shape is suitable for direct Hostinger upload: copy the repository's deployable root contents into `public_html`; do not create an additional `public/` directory.
