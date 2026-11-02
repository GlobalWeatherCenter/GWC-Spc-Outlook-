# Global Weather Center — Rebuild V4

Complete GitHub Pages site. Upload all four files to your repository root (replace old files).

## Fixed
- State and city labels now use a separate SVG layer ABOVE the forecast polygons, not Leaflet marker panes.
- State labels are two-letter abbreviations, 19–24 px; city labels 16–20 px with black stroke.
- Zoom computes bounding regions from the highest relevant SPC risk, with bounds checks.
- Defaults to contiguous USA for outlooks with no severe risk. No extra no-risk message.
- Official NOAA FeatureServer data retained. No API key.

The label layer is local; NOAA SPC forecast requires live internet. Browser appearance cannot be verified from this offline environment.
