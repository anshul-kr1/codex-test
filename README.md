# Hallownest Echoes

A dark, atmospheric, single-page tribute site inspired by the mood and lore of *Hollow Knight*. Built with vanilla HTML, CSS, and JavaScript so it can be hosted on any static server (or opened directly from the filesystem).

## Features

- **Immersive theming** &mdash; Layered textures, ambient particles, and gothic typography evoke the feel of Hallownest without reusing copyrighted assets.
- **Responsive layout** &mdash; Carefully tuned from 320&nbsp;px wide phones to large desktop screens.
- **Accessible interactions** &mdash; Semantic structure, keyboard-friendly navigation, focus styles, and respect for `prefers-reduced-motion`.
- **Interactive gallery** &mdash; Hover reveals, modal enlargements with focus trapping, and descriptive alt text.
- **Custom iconography** &mdash; Original SVG silhouettes inspired by charms, masks, and the Pale Nail.

## Project structure

```
.
├── index.html              # Single-page experience with semantic sections
├── styles.css              # Theme variables, layout, animations
├── script.js               # Navigation, scroll reveal, particles, and modal logic
├── assets/
│   ├── gallery/            # Procedurally generated atmospheric backdrops (.jpg)
│   ├── textures/           # Noise + vignette overlays (.png)
│   └── silhouettes/        # Custom SVG icons
└── README.md
```

## Run locally

This is a static site with no build step.

- **Option 1: open directly** – Double-click `index.html` (or drag it into your browser). All CSS and JS load locally.
- **Option 2: lightweight dev server** – From the project root, run:

  ```bash
  python3 -m http.server 8000
  ```

  Then visit <http://localhost:8000> in your browser. This avoids cross-origin restrictions for the ambient textures on certain browsers.

## Deploying to GitHub Pages

1. Push the project to a GitHub repository.
2. In the repository settings, enable **GitHub Pages**.
3. Choose the **Deploy from a branch** option and select the branch containing `index.html` (typically `main`), with the root folder (`/`).
4. Save your changes. Pages will build automatically, and the published URL will appear in the settings panel.

Because there is no build process, Pages will serve the site exactly as-is.

## Accessibility and performance notes

- Skip link, semantic landmarks, and ARIA attributes support assistive technologies.
- Interactive components are keyboard navigable with clear focus outlines.
- All animations pause when `prefers-reduced-motion: reduce` is set.
- Images use lazy loading and efficient dimensions; reusable CSS variables keep the bundle small (~30&nbsp;KB gzipped).

## Assets and licensing

- Gallery images and texture overlays are procedurally generated during development and released under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- SVG silhouettes are original shapes created for this project and also released under CC0.
- Hollow Knight and related lore belong to Team Cherry; this site is a non-commercial fan tribute.
