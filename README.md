# Global Weather Center — Weather Hub V14

Complete static GitHub Pages site. This build is based on **V13**, retaining the **V12 manual pinch engine**, state and county outlines, geographically positioned labels, Day 1–8 official SPC polygons, highest-risk focus, and 70% outlook polygon opacity.

## Files
- `index.html` — complete page layout
- `style.css` — broadcast-style responsive interface
- `app.js` — preserved SPC map and pinch engine, with minimal mode-awareness fixes
- `weather.js` — additional radar, alerts, watches, discussions, reports, satellite, search and streaming controls
- `README.md` — documentation

## Features and sources

1. **Outlooks** — official SPC outlook polygons (Day 1–8 and supported hazards), 70% opacity. NOAA SPC FeatureServer.
2. **Radar** — recent MRMS base-reflectivity images from the NOAA time-enabled ImageServer. A rolling sequence of eight requested 10-minute frames from approximately the last 85–15 minutes; the radar data service is not guaranteed to have every requested frame. Press Play or use Previous/Next. Image redraw is debounced after map movement. It is *not* a future radar forecast. NOAA radar reference: https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer
3. **Warnings** — active NWS Tornado Warning, Severe Thunderstorm Warning and Flash Flood Warning feed polygons; click for the actual text. Alerts without available geometries cannot be accurately drawn. https://api.weather.gov/alerts/active
4. **Watches** — active NWS Tornado Watch and Severe Thunderstorm Watch alert polygons, with direct official sources. The effective watch footprint may be county-based, and some alerts do not include map geometry. https://api.weather.gov/alerts/active
5. **Mesoscale Discussions** — SPC official polygon map service; click a polygon and follow the official SPC link. https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/spc_mesoscale_discussion/MapServer
6. **Storm Reports** — NOAA/NWS Local Storm Reports from the past 24 hours, classified into tornado, severe thunderstorm wind, and hail. These are **preliminary reports**, not a verified tornado database and not identical to the SPC preliminary reports product. https://mapservices.weather.noaa.gov/vector/rest/services/obs/nws_local_storm_reports/MapServer
7. **Satellite** — a NOAA/NESDIS GOES-19 GeoColor or infrared **CONUS satellite image viewer**. This is presented separately from the map, not as a georeferenced overlay. https://www.goes.noaa.gov/conus.php?sat=G19
8. **City search** — searches the built-in US city database, zooms to it, then looks up the closest official NWS observing station. If a station has no current data, the map search still works. https://api.weather.gov/points/{lat},{lon}
9. **Stream** — full-screen clean graphic, hides navigation, controls and credits; `F` toggles broadcast view and `Esc` exits. On iPads where browser Fullscreen API is unavailable, clean layout still engages within the browser viewport.

## Installation
1. Extract the downloaded ZIP on your iPad.
2. Upload the **five individual files** into the repository root, replacing the old files. Do not upload the ZIP itself.
3. GitHub Pages remains set to `main` / `/(root)`.
4. Refresh the published page (or append `?v=14` to the URL) after deployment.

## Important operational notes
- This is a client-only static site; it needs internet access. NOAA and NWS endpoints occasionally rate-limit, suffer outages, or block browser cross-origin requests. If a layer fails, the interface reports the error rather than inventing data.
- Some alert events provide *no polygon geometry*. They cannot be placed accurately without additional official geographic products.
- Satellite images are a separate NOAA image viewer, not a map-positioned satellite overlay.
- Radar may be slow to load and may not render all historical times. Image overlays are requested for the current map extent.
- **Not a sole source of safety-critical warnings**. Use weather.gov, spc.noaa.gov, and local official warnings for decisions.
- The JavaScript syntax and package integrity were checked locally; live data fetching and iPad touch gestures still require live browser verification after deployment.
