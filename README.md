# Global Weather Center V17 — live feed reliability

This five-file ZIP is a replacement for V16, with the working V12 custom pinch zoom kept unchanged.

## Changes
- Radar now defaults to NOAA's ArcGIS radar base reflectivity MapServer, using geographically registered raster tiles. When tiles fail it tries NOAA nowCOAST.
- Radar status distinguishes empty/clear areas from failed services.
- Warning, watch, discussion and local storm report panels show explicit empty-versus-error messages and links to official sources.
- No fake storms, watches or warnings are ever drawn.
- SPC outlook polygons retain 70% opacity, counties and city/state labels unchanged.

## Deploy
Extract and upload all 5 files to the root of your GitHub Pages repository; replace their previous versions.
Look for GWC LIVE FEEDS V17 in the footer.

## Constraints
Source services are public external networks. Some may refuse requests temporarily, deliver no active products, or render no precipitation during dry periods. This package's syntax has been checked, but live network behavior on iPad Safari is not yet verified.
