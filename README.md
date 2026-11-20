# Table Thirteen

A responsive restaurant menu and table-ordering demo built with plain HTML, CSS and JavaScript.

[Live demo](https://md-abdur-rahman-07.github.io/basicRestaurantTemplate/)

## Features

- 21 menu items with food photography, descriptions, dietary tags and prices.
- Scrollable categories, search, Vegan/Spicy filters and price sorting.
- Editable cart with synchronized quantities and a sticky order summary.
- Optional tips, checkout confirmation and order history saved in local storage.
- Light and dark themes, keyboard navigation, visible focus and reduced-motion support.
- Responsive layouts, locally served fonts and optimized WebP images.

Ordering and service requests are browser-local demos. Orders are saved on the current device; payments and kitchen delivery require a backend integration. Prices are in USD and include tax, with optional tips added at checkout.

## Getting started

Use Node.js 22 or newer:

```sh
npm ci
npm start
```

Open `http://127.0.0.1:4173/`. The site has no build step or runtime dependencies. Any static HTTP server can serve it; opening `index.html` through `file://` will not load its JavaScript modules reliably.

Set `PORT` to use a different local port. Set `TEST_URL` when running the checks against an existing preview at another address.

## Project structure

```text
index.html                   Main page
assets/css/design-system.css Fonts, colors, themes and base styles
assets/css/style.css         Components and responsive layouts
assets/js/menu.js            Menu items and currency formatting
assets/js/store.js           Cart, order history and storage validation
assets/js/script.js          Rendering and user interactions
assets/img/                  Favicon, menu photos and social cover
assets/fonts/                Local fonts and their licenses
tools/                       Local server and browser checks
```

Edit `assets/js/menu.js` to change products, categories, descriptions or prices. Prices use integer cents. The table label, page metadata and OrbitWick credit are in `index.html`; styling and theme tokens are in `assets/css/`.

## Testing

```sh
npm test
```

The suite checks filters, sorting, cart quantities, tips, checkout, persistence, keyboard focus, storage errors, stored HTML handling, responsive overflow and light/dark accessibility. It starts a temporary local server when needed and writes its report to the ignored `test-results/verification.json`.

Browser checks use installed Chrome on Windows, a browser supplied through `CHROME_PATH`, or Playwright Chromium. If a browser is not available, install one with:

```sh
npx playwright install chromium
```

## Deployment

Publish the repository root through GitHub Pages or another static host. `index.html` is the entry point, and the assets use relative paths. Update the canonical URL and Open Graph URLs in `index.html` when changing the hosting address.

Photo sources and font licenses are documented in [assets/README.md](assets/README.md).

Design and developed by [OrbitWick](https://orbitwick.com).
