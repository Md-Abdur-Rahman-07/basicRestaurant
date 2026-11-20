# Asset sources

The redesign serves photographs and fonts from the repository. There are no runtime requests to Unsplash, Pexels or Google Fonts. Photography is representative of the menu; it is not photography of a real restaurant's dishes.

## Photography

Images in `assets/img/menu/` are cropped to 640 × 430 WebP at quality 79. `hero-pizza.webp` is a 1200 × 800 crop at quality 84 of the same margherita image. `hero-pizza-small.webp` is a 768 × 512 responsive variant at quality 73 (53 KB), used to reduce loading time on small screens.

`social-cover.jpg` is a 1200 × 630 Open Graph card composed from the same margherita photograph and Table Thirteen typography on a deep green field. The exported artwork uses Georgia/Arial; the website uses the local DM fonts below.

Unsplash photographs are available under the [Unsplash License](https://unsplash.com/license); Pexels photographs are available under the [Pexels License](https://www.pexels.com/license/). Source links below identify the downloaded originals.

| Local filename | Source |
| --- | --- |
| `pizza.webp`, `hero-pizza.webp` | [Margherita with basil — Brelyn Bashrum, Unsplash](https://unsplash.com/photos/a-freshly-baked-margherita-pizza-with-basil-GuhZ2lXdgGA) |
| `burger.webp` | [Unsplash original](https://images.unsplash.com/photo-1568901346375-23c9450c58cd) |
| `pasta.webp` | [Unsplash original](https://images.unsplash.com/photo-1473093226795-af9932fe5856) |
| `salad.webp` | [Caesar salad — alleksana, Pexels](https://www.pexels.com/photo/a-close-up-shot-of-a-delicious-caesar-salad-6107787/) |
| `curry.webp` | [Unsplash original](https://images.unsplash.com/photo-1603894584373-5ac82b2ae398) |
| `tacos.webp` | [Unsplash original](https://images.unsplash.com/photo-1551504734-5ee1c4a1479b) |
| `steak.webp` | [Unsplash original](https://images.unsplash.com/photo-1544025162-d76694265947) |
| `sushi.webp` | [Unsplash original](https://images.unsplash.com/photo-1579871494447-9811cf80d66c) |
| `pancakes.webp` | [Unsplash original](https://images.unsplash.com/photo-1528207776546-365bb710ee93) |
| `tofu.webp` | [Tofu stir-fry — Zoshua Colah, Unsplash](https://unsplash.com/photos/tofu-stir-fry-noodles-in-bowl-3dGngNs0kpY) |
| `cola.webp` | [Unsplash original](https://images.unsplash.com/photo-1622483767028-3f66f32aef97) |
| `pepsi.webp` | [Pepsi can — Martin Péchy, Pexels](https://www.pexels.com/photo/person-holding-pepsi-can-1292294/) |
| `lemonade.webp` | [Lemonade — Denys Gromov, Pexels](https://www.pexels.com/photo/glass-of-lemonade-18142613/) |
| `ice-cream.webp` | [Unsplash original](https://images.unsplash.com/photo-1563805042-7684c019e1cb) |
| `red-velvet.webp` | [Unsplash original](https://images.unsplash.com/photo-1586788680434-30d324b2d46f) |
| `sandwich.webp` | [Unsplash original](https://images.unsplash.com/photo-1528735602780-2552fd46c7af) |
| `salmon.webp` | [Unsplash original](https://images.unsplash.com/photo-1467003909585-2f8a72700288) |

## Typography

- **DM Sans**, Latin variable, weights 100–1000: `assets/fonts/DMSans-Latin.woff2` (36,932 bytes).
- **DM Serif Display**, Latin regular: `assets/fonts/DMSerifDisplay-Regular.woff2` (24,744 bytes).
- Downloaded from the [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&family=DM+Serif+Display&display=swap). The website defines local `@font-face` rules with `font-display: swap`.
- Both families use the SIL Open Font License. Copies are retained at `assets/fonts/dmsans-OFL.txt` and `assets/fonts/dmserifdisplay-OFL.txt`.

