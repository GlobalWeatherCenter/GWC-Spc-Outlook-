# Global Weather Center — V13

Full static site for GitHub Pages: index.html, app.js, style.css, README.md.

## What's new in V13
- Keeps the working custom pinch-zoom from V12.
- Adds more city detail as you zoom further in.
- Adds county boundary lines at closer zoom levels.
- Adds a subtle glow to the state/map outlines for a cleaner broadcast look.
- Preserves 70% opacity on all SPC outlook fills.

## Deploy
Upload the four files at the repository root, then use GitHub Pages from `main / (root)`.
Refresh the browser after deployment.

## Notes
County lines are loaded from a simplified US counties dataset and only appear when zoomed in enough to avoid clutter.
