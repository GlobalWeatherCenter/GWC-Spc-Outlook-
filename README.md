# Global Weather Center — Weather Hub V16

A static GitHub Pages severe-weather website. Upload all five files (`index.html`, `app.js`, `weather.js`, `style.css`, `README.md`) to the **root** of your existing repository. Keep GitHub Pages configured to deploy from main / (root). Refresh the website after publishing.

## V16 changes

- **Radar:** defaults to NOAA nowCOAST live MRMS base reflectivity (a real, current radar WMS service). A separate **Animated History** control uses RainViewer historical tiles when available; it falls back to NOAA live radar if that service fails. Radar visibility still depends on precipitation being present and source coverage.
- **Warnings, watches, discussions:** brighter colour-coded navigation, larger clickable alert polygons, a details drawer and a **View Alerts / View Watches / View Discussions** list. The red **VIEW ALERTS** button in the site header switches directly to the Warnings section.
- **Cities:** stable geographic city and state labels, redrawn only after map movement settles; screen-size recalculation after changing sections.
- **Zoom performance:** county borders use a single shared TopoJSON line mesh drawn on canvas instead of thousands of SVG polygons. The V12 working custom two-finger pinch engine has not been modified.
- Keeps the SPC days/risks, 70% opacity, city search and weather readings, GOES satellite, storm reports, and Stream mode.

## Sources and limitations

Official SPC outlooks and NWS alerts are live data. NOAA nowCOAST radar is live but *not a historical animation*. RainViewer historical animation is available only if its external service and tiles are accessible. RainViewer's free API has restrictions and is intended for personal/educational use. Attribution is on the radar page. No API keys are included.

This package has passed JavaScript syntax and static-file checks. The external live feeds and iPad Safari touch performance have **not** been verified end-to-end, so check the published site and its status messages. If a live feed is unavailable, it will display a source error rather than fabricate weather information.
