# Global Weather Center — V11 (gesture-safe SPC map)

This is a complete static GitHub Pages site. Upload `index.html`, `app.js`, `style.css` and `README.md` to the repository root.

## What changed in V11
- NOAA requests cannot override a user's ongoing or recently completed pinch / drag / wheel gesture.
- A request started before a user moved the map cannot unexpectedly recenter it when the data arrives.
- Disabled Leaflet animated zoom and marker zoom transitions to avoid iPad visual overshoot.
- Kept native two-finger pinch and pan, with a separate **FOCUS RISK** control to recenter deliberately.
- Kept the V10 focus priority, labels, SPC overlays and 70% fill opacity.
- Added a unique V11 version identifier and cache-busting URLs for GitHub Pages.

## Testing
The JavaScript parser check only confirms syntax. Verify pinch behaviour on the target iPad and published GitHub Pages site before relying on it. If it still jumps, record a short screen video: iPadOS Safari has several distinct touch event behaviours, which can be diagnosed from motion and timing.
