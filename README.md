# Global Weather Center — SPC Outlooks

A full-screen, one-outlook-at-a-time broadcast-style weather map for GitHub Pages / OBS, using **live official NOAA Storm Prediction Center geographic polygons**, not fabricated risk zones.

## Features
- Individual Day 1–8 tabs
- Days 1–2: categorical, tornado, wind, hail probability
- Day 3: categorical and combined severe probability
- Days 4–8: individual long-range probabilities
- Automatic zoom into the main risk area, falling back to all published polygons if needed
- City labels selected from locations inside the outlook polygons, with overlap reduction
- Flat dark map, clean title, bottom legend and Global Weather Center branding
- Refresh button; automatic 10-minute refresh while page is visible
- No server, no API keys, no paid dependencies

## Publish on GitHub Pages
1. Create a public GitHub repository (e.g. `global-weather-center-spc`).
2. Upload `index.html`, `style.css` and `app.js` to the repository root (not the ZIP file itself).
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch → main → /(root)** and save.
5. Open `https://YOUR_USERNAME.github.io/global-weather-center-spc/` after GitHub finishes deploying.

## OBS
Add a Browser Source pointing to the GitHub Pages URL, with width 1920 and height 1080. You can hide the GitHub site header via OBS crop if needed, but the design is intended to fill the browser frame.

## Sources
- NOAA SPC forecast polygons: https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/FeatureServer
- Background: CSS dark fill (no third-party map tiles or API key)
- State outlines: PublicaMundi `MappingAPI` US states GeoJSON
- Mapping engine: Leaflet

The page depends on access to the external map and NOAA services, including their browser CORS policies. If the NOAA service is unavailable it reports an error rather than showing sample polygons. This page is not an official NOAA product. Always consult https://www.spc.noaa.gov/ for authoritative forecast interpretation and safety guidance.

## Notes
Day 3 and Days 4–8 do not have separate tornado/wind/hail SPC outlook maps. City names are based on an embedded curated place list and are **not** a census of all locations at risk. Outlook polygons are coloured based on the service's `dn` risk codes; significant/hatched overlays are not presently shown. The site has not been validated against a deployed GitHub Pages browser session.
