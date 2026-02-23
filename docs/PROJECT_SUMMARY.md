# Nodo — Project Summary

## Overview

**Project Name**: Nodo child-classic theme
**Purpose**: PrestaShop 9 child theme for a fashion/T-shirt store catalog (nodo.gogarage.cz)
**Type**: PrestaShop 9 child theme (CSS + JS overrides of the classic parent theme)
**Version**: 1.0.0
**Repo**: https://github.com/spoofan/nodo.git
**Live site**: https://nodo.gogarage.cz/

---

## Architecture

```
nodo/ (git repo root = /private/tmp/ps-modules/nodo/)
├── assets/
│   ├── css/
│   │   ├── custom.css      ← main theme overrides (priority 200, ~810 lines)
│   │   └── overrides.css   ← high-specificity !important rules (priority 210)
│   ├── js/
│   │   └── custom.js       ← sticky header scroll class toggle
│   └── img/
│       └── nodo-logo.jpg   ← interlocking knot logo mark
└── config/
    └── theme.yml           ← PS theme registration (assets, layouts, image types)
```

**Server path**: `themes/child-classic/` on `37.9.175.163`
**Parent theme**: PrestaShop classic (Bootstrap 4 alpha 5)
**Only CSS + JS are customized** — no `.tpl` template files are overridden.

---

## Design System: "Dark Craft Editorial"

| Token | Value | Usage |
|-------|-------|-------|
| `--nodo-bg` | `#F8F6F2` | Warm off-white page background |
| `--nodo-ink` | `#111111` | Near-black text |
| `--nodo-accent` | `#C9581E` | Terracotta — buttons, overlines, flags |
| `--nodo-mid` | `#888888` | Secondary text, borders |
| `--nodo-subtle` | `#E8E5DF` | Dividers, card borders |
| `--nodo-white` | `#FFFFFF` | Card backgrounds |

**Fonts** (Google Fonts, loaded via `@import`):
- **Cormorant Garamond** — display/headings (fashion editorial serif)
- **Jost** — UI/body (geometric sans-serif)

---

## Catalog Mode (current state)

The store is currently configured as a **product catalog only** — no purchasing flow is visible:

| Element | Status |
|---------|--------|
| Prices | Hidden everywhere (CSS `display: none`) |
| Login / account link | Hidden |
| Shopping cart | Hidden |
| Add to cart button + quantity | Hidden |
| Product comments / reviews | Hidden |
| Social sharing buttons | Hidden |

To re-enable purchasing: remove the "CATALOG MODE" section at the bottom of `custom.css`.

---

## Key Features Implemented

### Product Cards
- White background, 2px radius, no shadow
- Image scales on hover (`transform: scale(1.04)`)
- Dark overlay scrim via `::after` pseudo-element on hover
- Product title in Cormorant Garamond
- `fadeUp` animation with stagger on first 8 cards

### Header
- Sticky (`position: sticky; top: 0`) with frosted glass (`backdrop-filter: blur(8px)`)
- `.scrolled` class added by JS at 20px scroll depth → adds border-bottom
- Knot logo mark (52×52px) via CSS `content: url()` on `img.logo`
- Search input overflow fix via `min-width: 0; flex: 1 1 auto`

### Section Titles
- Cormorant Garamond, font-weight 300
- Thin terracotta overline (`border-top: 2px solid var(--nodo-accent)`)
- Left-aligned, no uppercase transformation

### Footer
- Dark background (`#111111`) with warm-gray text
- Links hover to terracotta

### Logo
- Source image: `https://cdn.vectorstock.com/i/500p/15/56/interlocking-knot-symbol-set-vector-48841556.jpg`
- Stored at: `assets/img/nodo-logo.jpg` (21KB JPEG)
- Applied via: `img.logo { content: url('/themes/child-classic/assets/img/nodo-logo.jpg') !important; }`

---

## Server & Deployment

### Credentials
| Service | Value |
|---------|-------|
| SFTP host | `37.9.175.163:22` |
| SFTP user | `nodo.gogarage.cz` |
| SFTP pass | `NodoHeslo.123` |
| PS Admin URL | `https://nodo.gogarage.cz/admin249srzmsswjc1n2j3lp` |
| PS Admin user | `info@nodo.cz` |
| PS Admin pass | `NodoHeslo.123` |

### Deploy workflow (SFTP with expect)
```bash
# Standard CSS deploy
expect /tmp/sftp_deploy3.exp
# After uploading, clear PS cache via admin to regenerate CSS bundle
# Admin → Nástroje → Výkon → Vyčistit mezipaměť
```

The deploy script `/tmp/sftp_deploy3.exp` uploads:
- `assets/css/custom.css` → `themes/child-classic/assets/css/custom.css`
- `assets/css/overrides.css` → `themes/child-classic/assets/css/overrides.css`
- `config/theme.yml` → `themes/child-classic/config/theme.yml`

### Cloudflare caching gotcha
CF caches static assets (`*.css`, `*.jpg`) with `max-age=604800` (7 days).
**Workaround**: After uploading CSS, clear PS cache via admin → PS regenerates a new hash-named bundle (`theme-XXXXXXX.css`). If the hash changes, CF serves the new file fresh.
Clearing PS cache changes the bundle hash when `custom.css` content changes.

### PS Performance settings (current dev config)
| Setting | Value |
|---------|-------|
| Smarty cache | OFF (debug mode) |
| Debug mode | ON |
| Smart cache for CSS | ON (generates hash bundle) |
| Smart cache for JS | ON |

---

## PS Theme Configuration (theme.yml)

- **Default layout**: `layout-full-width`
- **Category/listing pages**: `layout-left-column`
- **CSS assets**: `custom.css` (priority 200) + `overrides.css` (priority 210)
- **Uses parent assets**: `true`
- **Image types**: standard PS sizes (cart 125px, small 98px, medium 452px, large 800px, etc.)

---

## Files Modified / Created

| File | Change |
|------|--------|
| `assets/css/custom.css` | Full rewrite — Dark Craft Editorial design system + catalog mode |
| `assets/css/overrides.css` | Created — high-specificity `!important` rules for flags, buttons, price color |
| `assets/js/custom.js` | Extended — added sticky header `.scrolled` class toggle |
| `assets/img/nodo-logo.jpg` | Created — knot logo mark |
| `config/theme.yml` | Extended — added `overrides.css` as second CSS asset |

---

## Known Limitations

1. **Logo via CSS `content:`** — works in Chrome/Firefox but is non-standard for `<img>` elements. The PS admin logo (`img/logo.png`) is not replaced on the server.
2. **`overrides.css` not auto-loaded** — PS Symfony DI container must be cleared after changes to `theme.yml` for the file to appear in the bundle. Clearing PS cache via admin handles this.
3. **CF cache TTL** — if the PS bundle hash doesn't change after an edit, Cloudflare serves stale CSS for up to 7 days. Fix: always clear PS admin cache after uploading to force a new bundle hash.
4. **No SSH access** — server only allows SFTP. All remote operations use `expect` scripts.
5. **Customer Reassurance module** — product detail page shows "edit with the Customer Reassurance module" placeholder texts. These come from an unset module, not the theme.

---

## Future Considerations

1. **Replace logo properly** — upload knot logo via PS Admin → Design → Theme & Logo instead of CSS `content:` hack
2. **Re-enable catalog** — when ready to sell, remove the CATALOG MODE section from `custom.css`
3. **Catalog page design** — the category listing pages haven't been deeply styled; left-column layout with filters could be improved
4. **Product page** — size/color picker UI, image gallery zoom are hidden by catalog mode; review when purchasing is re-enabled
5. **Custom font preloading** — add `<link rel="preload">` for Google Fonts to improve LCP
6. **CF cache control** — add `.htaccess` `Cache-Control: no-store` to `themes/child-classic/assets/cache/` to prevent CF re-caching bundles
7. **Mobile review** — carousel height (240px mobile), grid stacking not fully tested

---

## Session History

| Date | Summary |
|------|---------|
| 2026-02-22 | Initial Dark Craft Editorial redesign: full custom.css rewrite, JS sticky header, SFTP deploy |
| 2026-02-22 | Fixed CSS specificity for product flags/buttons/prices vs parent classic theme |
| 2026-02-22 | Added overrides.css; diagnosed and worked around Cloudflare CSS bundle caching |
| 2026-02-23 | Catalog mode: logo swap, hide prices/cart/login/comments/reviews; CF bypass via PS cache clear → new bundle hash |

---

*Last updated: 2026-02-23*
