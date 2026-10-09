# AVORA

A complete, responsive furniture concept website. The site includes a layered room opening, three-piece collection, product detail dialogs with a closer view, locally saved favourites, accessible material tabs, care guidance, and a downloadable personal design brief.

The cinematic art direction continues through every section: full room product panels, warm typography, photographic material details, an atmospheric story section, and a matching planning form. The opening screen tracks image and font readiness, honours reduced motion, and exits after at most eight seconds even if an asset fails.

## Run locally

From this folder, run `python -m http.server 4173 --bind 127.0.0.1`, then open http://127.0.0.1:4173/.

No build step or dependencies are required. Furniture assets are stored locally. Google Fonts has system font fallbacks.

## Behaviour

- Favourites are stored in this browser's local storage.
- Design briefs are generated and downloaded locally. No form data is sent to a server.
- AVORA is an imaginary brand. There are no real orders, payments, prices, or inventory.
- The opening uses separate image planes with perspective and pointer parallax. Product panels tilt and catch light; the material panel and samples have physical depth.
- The spatial gallery uses Three.js to render a real 3D exhibition: framed furniture photographs, bronze architecture, lit floors, sculptures, and a scroll-driven camera. The furniture itself remains the original artwork, not a rotatable model.
- Reduced motion preferences are respected.

Local recovery snapshots and superseded viewer files are excluded from Git.
