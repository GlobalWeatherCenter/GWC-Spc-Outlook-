GWC build: 02 Nov 2026 20:43 UTC. Visible version appears along bottom of site.

# Global Weather Center — SPC Outlooks

Full replacement GitHub Pages version. Upload **index.html, app.js, style.css, README.md** to the root of your existing public repository. Keep GitHub Pages configured for main / (root).

## Changes
- Map opens on the contiguous United States when there is no meaningful risk.
- Risk zoom uses the primary higher-risk SPC polygon rather than outer polygons.
- Two-letter state abbreviations are permanently plotted.
- City names display in and around the map and reflow with risk extent.
- No API-key basemap; state borders load from public open GeoJSON.

## Data sources
NOAA SPC polygons: https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/FeatureServer
State borders: PublicaMundi / MappingAPI GeoJSON on GitHub. Requires internet access.

## Troubleshooting
After uploading, hard refresh Safari or open the page in a private tab if an older script is cached. No current SPC risk does not mean no severe weather is possible. Always use spc.noaa.gov for safety decisions.

## Latest changes
- Large two-letter state abbreviations (TX, OK, KS etc.) in a dedicated label pane above the SPC polygons.
- Large high-contrast city labels, including on default USA view; labels redraw as map moves or zooms.
- Removed the informational banners about defaulting to the US when there is no meaningful risk.
- Map keeps NOAA SPC polygons and defaults to the continental US for no focused risk.
