# Global Weather Center — V12

Full static site for GitHub Pages: index.html, app.js, style.css, README.md.

## Gesture fix
Native Leaflet `touchZoom` is disabled. Instead, a custom two-finger handler updates zoom and position together, anchored at the midpoint of the fingers, using Leaflet projection coordinates. The NOAA polygons and city/state markers use the same map projection while moving. No touch-end camera correction, and labels are de-cluttered only after pinch completes.

A *Focus Risk* button recovers the highest-risk region when desired. Forecast layers remain 70% opaque.

## Deploy
Upload the three web files at the repository root, then use GitHub Pages from main / (root). The included README is optional to run the page. Refresh browser after deployment.

## Test
On an iPad: select Day 1, pinch with two fingers and move them sideways during the pinch, release, and confirm no positional correction. Also test single-finger panning, Focus Risk, and changing days.

Not yet verified on a physical iPad Safari device.
