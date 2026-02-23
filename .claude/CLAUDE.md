# Nodo — child-classic theme

PrestaShop 9 child theme for nodo.gogarage.cz (fashion/T-shirt catalog store).
All changes are CSS + JS only — no `.tpl` template files are touched.

## Project Structure

```
nodo/
├── assets/
│   ├── css/
│   │   ├── custom.css      ← main styles (~810 lines, edit this)
│   │   └── overrides.css   ← !important specificity fixes
│   ├── js/
│   │   └── custom.js       ← sticky header scroll effect
│   └── img/
│       └── nodo-logo.jpg   ← knot logo (52×52)
└── config/
    └── theme.yml           ← PS asset registration
```

## Deploy

```bash
# 1. Edit assets/css/custom.css (or overrides.css)
# 2. Upload via SFTP
expect /tmp/sftp_deploy3.exp

# 3. Clear PS cache to force new bundle hash (bypasses CF cache)
# Admin → Nástroje → Výkon → Vyčistit mezipaměť
# URL: https://nodo.gogarage.cz/admin249srzmsswjc1n2j3lp/configure/advanced/performance/

# 4. Commit & push
git add assets/ && git commit -m "..." && git push
```

## Server Access

| | |
|-|-|
| SFTP | `sftp -P 22 nodo.gogarage.cz@37.9.175.163` (pass: `NodoHeslo.123`) |
| PS Admin | `https://nodo.gogarage.cz/admin249srzmsswjc1n2j3lp` (`info@nodo.cz` / `NodoHeslo.123`) |
| Server path | `themes/child-classic/` |

## Design Tokens

```css
--nodo-bg: #F8F6F2     /* warm off-white */
--nodo-ink: #111111    /* near-black */
--nodo-accent: #C9581E /* terracotta */
--nodo-mid: #888888
--nodo-subtle: #E8E5DF
```

Fonts: **Cormorant Garamond** (headings) + **Jost** (UI) via Google Fonts `@import`.

## Current State: Catalog Mode

Prices, login, cart, add-to-cart, reviews are all hidden via CSS.
To re-enable: remove the `/* CATALOG MODE */` section at the bottom of `custom.css`.

## Important Notes

- **CF cache**: Cloudflare caches CSS bundles 7 days. Always clear PS cache after uploading to force a new `theme-XXXXXXX.css` hash URL.
- **No SSH**: server is SFTP only. Use `expect` scripts in `/tmp/sftp_*.exp`.
- **overrides.css**: only loaded when PS cache is cleared (bundle regenerated). Contains `!important` rules for flags/buttons/prices.
- **Debug mode ON**: PS Smarty cache is disabled, debug mode enabled for faster dev iteration.
- **Logo**: applied via CSS `content: url()` on `img.logo`, not via PS admin logo upload.

## Related Docs

- [docs/PROJECT_SUMMARY.md](../docs/PROJECT_SUMMARY.md) — full technical reference
