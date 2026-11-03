# Global Weather Center — Risk Focus V10

A static GitHub Pages site for live SPC severe weather polygons, branded Global Weather Center.

## V10 changes

- On outlook selection, focus on the **largest connected area within the highest published risk level**, not broad marginal or general thunderstorm contours. If there is an Enhanced risk, it takes precedence over Slight. If no risk polygon exists, show the contiguous United States.
- Zoom closer to the risk area, while keeping the largest high-risk polygon in frame.
- Pinch zoom has **no quarter-step snapping** (`zoomSnap:0`) and **no rebound at the zoom limits** (`bounceAtZoomLimits:false`). The map does not trigger a second repositioning after you lift your fingers.
- Updating NOAA data and pressing Refresh do not override the user's manually chosen map position. Choosing a different outlook intentionally re-centres the camera.
- Keeps geographic city/state labels, official NOAA polygon overlays and **70% fill opacity**.

## Install

Extract the ZIP, upload `index.html`, `app.js`, `style.css`, and `README.md` to the root of your GitHub Pages repository, and commit. Confirm that `GWC RISK FOCUS V10` appears on the page. A hard refresh can help with browser caching.

## Notes

On very small or unusually elongated severe-risk polygons, a minimum camera zoom is used to keep the forecast readable. Risk polygons and city labels depend on online third-party services. If SPC has no relevant risk zone, the view defaults to the contiguous United States.
