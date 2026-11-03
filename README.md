# Global Weather Center — Weather Hub V15

Static GitHub Pages package: `index.html`, `app.js`, `style.css`, `weather.js`, `README.md`.

## Changes in V15
- Weather radar switched from fragile viewport image exports to geographically anchored RainViewer radar tiles, with the latest historical frames and play/pause/previous/next/refresh controls.
- **Radar attribution:** Radar images © RainViewer. The free API is intended for personal / educational / small-community use; commercial broadcasting or heavy traffic may require a separate arrangement. See https://www.rainviewer.com/api.html.
- City markers remain above all weather layers; extra contrast helps legibility.
- Click mapped severe warning/watch polygons or mesoscale discussion polygons to open details. `VIEW EVENTS` and `VIEW DISCUSSIONS` buttons are supplied for browsing event details, including alerts without usable geographic polygons.
- The original V12 custom pinch zoom, V13 county lines and glow, SPC outlooks, 70% risk polygon opacity, satellite, reports, city search and stream mode remain.

## Deployment
Upload all **five** files to the root of the existing GitHub Pages repository (`main` / `(root)`). Replace old files. Hard refresh the page; the footer will display `GWC RADAR & POPUPS V15`.

## Data and limitations
All weather feeds are external live services and may be unavailable or rate-limited. Radar is now from RainViewer, not the NOAA MRMS source from V14. The radar API requires no key, but its free tier is intended for non-commercial use. Storm warnings and watches are from NWS active alerts; some watches have null geometry and appear in the event list rather than as clickable map polygons. Mesoscale discussion polygon data comes from NOAA SPC; full discussion wording remains on the official SPC linked page.

JavaScript syntax has been checked. Browser and iPad touch behaviour require validation on the published site; no live alert or radar availability is guaranteed.
