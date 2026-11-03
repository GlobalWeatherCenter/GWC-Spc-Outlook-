/* Global Weather Center — live polygons directly from NOAA/NWS SPC REST service */
const BASE='https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/FeatureServer';
const LAYERS={1:{cat:1,tor:3,wind:7,hail:5},2:{cat:9,tor:11,wind:15,hail:13},3:{cat:17,prob:19},4:{prob:21},5:{prob:22},6:{prob:23},7:{prob:24},8:{prob:25}};
const TYPES={cat:'CATEGORICAL',tor:'TORNADO',wind:'WIND',hail:'HAIL',prob:'SEVERE PROBABILITY'};
const CATEGORY=[['TSTM','#7edb76',2],['MRGL','#138d1d',3],['SLGT','#ffd400',4],['ENH','#ff8b00',5],['MDT','#d80b23',6],['HIGH','#ec35c2',8]];
const PROB=[['2%','#008b14',2],['5%','#986a29',5],['10%','#e8cc26',10],['15%','#f7ce12',15],['30%','#fc7020',30],['45%','#db282d',45],['60%','#b640a5',60],['75%','#985eb7',75],['90%','#6a3da6',90]];
// Official SPC tornado colour palette. All SPC risk polygon fills use 70% opacity.
const TORNADO=[['2%','#79ba7a',2],['5%','#bd998a',5],['10%','#ffe481',10],['15%','#ff8080',15],['30%','#ff80ff',30],['45%','#c896f7',45],['60%','#104e8b',60]];
const CITIES=[
['New York',40.713,-74.006,10],['Los Angeles',34.052,-118.244,10],['Chicago',41.878,-87.63,10],['Houston',29.76,-95.37,10],['Phoenix',33.448,-112.074,10],['Philadelphia',39.952,-75.165,9],['San Antonio',29.424,-98.494,9],['San Diego',32.716,-117.161,9],['Dallas',32.777,-96.797,10],['Austin',30.267,-97.743,9],['Jacksonville',30.332,-81.656,8],['Fort Worth',32.755,-97.33,9],['Columbus',39.962,-83,8],['Indianapolis',39.768,-86.158,8],['Charlotte',35.227,-80.843,8],['San Francisco',37.775,-122.419,8],['Seattle',47.606,-122.332,8],['Denver',39.739,-104.99,9],['Washington DC',38.907,-77.037,9],['Nashville',36.163,-86.781,9],['Oklahoma City',35.468,-97.516,10],['El Paso',31.761,-106.485,8],['Detroit',42.331,-83.046,9],['Memphis',35.15,-90.049,9],['Louisville',38.253,-85.759,9],['Baltimore',39.29,-76.612,9],['Boston',42.36,-71.059,9],['Portland',45.515,-122.679,8],['Las Vegas',36.17,-115.14,9],['Milwaukee',43.038,-87.906,8],['Albuquerque',35.085,-106.65,8],['Tucson',32.222,-110.975,8],['Fresno',36.737,-119.788,7],['Sacramento',38.581,-121.494,8],['Kansas City',39.1,-94.579,9],['Atlanta',33.749,-84.388,9],['Miami',25.762,-80.192,9],['Tampa',27.951,-82.458,8],['Orlando',28.538,-81.379,8],['Pittsburgh',40.441,-79.996,8],['Cleveland',41.5,-81.694,8],['Cincinnati',39.103,-84.512,8],['St. Louis',38.627,-90.199,9],['Minneapolis',44.978,-93.265,9],['New Orleans',29.951,-90.072,8],['Tulsa',36.154,-95.993,9],['Wichita',37.687,-97.33,9],['Omaha',41.256,-95.934,9],['Lincoln',40.814,-96.703,7],['Topeka',39.048,-95.678,7],['Amarillo',35.222,-101.831,8],['Lubbock',33.578,-101.855,8],['Midland',31.997,-102.078,7],['Abilene',32.449,-99.733,7],['Waco',31.549,-97.147,7],['San Angelo',31.464,-100.437,7],['Wichita Falls',33.914,-98.493,7],['Lawton',34.604,-98.395,7],['Norman',35.223,-97.439,7],['Stillwater',36.116,-97.058,7],['Enid',36.396,-97.879,7],['Dodge City',37.753,-100.018,7],['Salina',38.84,-97.611,7],['Emporia',38.404,-96.182,6],['Little Rock',34.746,-92.289,8],['Fayetteville',36.063,-94.158,7],['Springfield',37.209,-93.292,7],['Columbia',38.952,-92.334,7],['Des Moines',41.586,-93.625,8],['Sioux Falls',43.547,-96.731,7],['Rapid City',44.081,-103.231,7],['Bismarck',46.808,-100.783,7],['Fargo',46.877,-96.79,7],['Grand Forks',47.925,-97.033,6],['Duluth',46.786,-92.1,7],['Rochester',44.012,-92.48,7],['Madison',43.073,-89.401,7],['Green Bay',44.514,-88.02,7],['Peoria',40.694,-89.589,7],['Springfield IL',39.782,-89.65,7],['Evansville',37.972,-87.571,7],['Bowling Green',36.968,-86.48,7],['Chattanooga',35.046,-85.31,7],['Knoxville',35.961,-83.921,7],['Huntsville',34.73,-86.586,7],['Birmingham',33.519,-86.811,8],['Montgomery',32.367,-86.3,7],['Mobile',30.695,-88.04,7],['Jackson',32.299,-90.185,7],['Hattiesburg',31.327,-89.29,6],['Baton Rouge',30.451,-91.187,7],['Shreveport',32.525,-93.75,7],['Monroe',32.509,-92.119,6],['Beaumont',30.08,-94.127,7],['Corpus Christi',27.8,-97.396,7],['Laredo',27.531,-99.507,7],['McAllen',26.203,-98.23,7],['Tyler',32.352,-95.301,7],['Longview',32.501,-94.74,7],['Texarkana',33.426,-94.048,6],['Colorado Springs',38.834,-104.821,7],['Pueblo',38.254,-104.609,6],['Cheyenne',41.14,-104.82,7],['Casper',42.85,-106.326,6],['Boise',43.616,-116.202,8],['Salt Lake City',40.76,-111.891,8],['Spokane',47.659,-117.426,7],['Billings',45.783,-108.501,7],['Missoula',46.872,-113.994,6],['Reno',39.53,-119.814,7],['Bakersfield',35.373,-119.018,7],['Fresno',36.737,-119.788,7],['Savannah',32.08,-81.09,7],['Columbia SC',34,-81.034,7],['Charleston',32.776,-79.931,7],['Raleigh',35.779,-78.638,8],['Greensboro',36.073,-79.792,7],['Richmond',37.541,-77.436,7],['Norfolk',36.85,-76.286,7],['Roanoke',37.271,-79.942,7],['Buffalo',42.886,-78.878,7],['Syracuse',43.048,-76.147,7],['Albany',42.652,-73.757,7]
];
let day=1,type='cat',weatherLayer=null,labelsLayer=null,stateLabelsLayer=null,activeController=null,requestId=0,lastFeatures=[];
let stateOutlineGlowLayer=null,stateOutlineLayer=null,countyOutlineGlowLayer=null,countyOutlineLayer=null,countyGeoJson=null;
// A user gesture always wins over a pending SPC network response.
let gestureSerial=0, gestureActive=false, selecting=false, selectedFeaturesLoaded=false;
let gestureIdleTimer=null;
let pinchState=null;
const US_BOUNDS=[[24.5,-125],[49.6,-66.5]];
const STATES=[['WA',47.4,-120.7],['OR',43.9,-120.5],['CA',36.8,-119.4],['NV',39.2,-116.7],['ID',44.3,-114.4],['MT',47,-109.6],['WY',43,-107.6],['UT',39.3,-111.8],['AZ',34.2,-111.7],['NM',34.5,-106],['CO',39,-105.5],['ND',47.5,-100.5],['SD',44.4,-100.2],['NE',41.6,-99.7],['KS',38.5,-98.3],['OK',35.6,-97.3],['TX',31.1,-99.1],['MN',46,-94.5],['IA',42.2,-93.5],['MO',38.5,-92.4],['AR',34.8,-92.3],['LA',31,-92.3],['WI',44.6,-89.8],['IL',40,-89.1],['MI',44.3,-85.5],['IN',40,-86.2],['OH',40.3,-82.8],['KY',37.7,-85.3],['TN',35.8,-86],['MS',32.6,-89.8],['AL',32.8,-86.8],['GA',32.5,-83.4],['FL',28.1,-82],['SC',33.8,-80.9],['NC',35.6,-79.9],['VA',37.6,-78.9],['WV',38.7,-80.5],['PA',40.9,-77.8],['NY',42.7,-75.5],['VT',44,-72.7],['NH',43.8,-71.6],['ME',45.2,-69.1],['MA',42.3,-71.7],['CT',41.6,-72.7],['RI',41.5,-71.5],['NJ',40.1,-74.5],['DE',39,-75.4],['MD',39,-76.7]];
function defaultView(){map.stop();map.fitBounds(US_BOUNDS,{animate:false,padding:[18,18]});}
// Labels are geographic Leaflet markers: Leaflet moves them with the map,
// including during pinch/scroll zoom, so they cannot drift on screen.
// Keep the geographic markers stable. Do not destroy/recreate during every camera tick.
let labelMarkers=[];
let labelKey='';
let labelRebuildTimer=0;
function clearLabels(){for(const m of labelMarkers)map.removeLayer(m);labelMarkers=[];}
function renderLabels(){
 if(pinchState || map._animatingZoom || map._panAnim?._inProgress)return;
 clearTimeout(labelRebuildTimer);
 labelRebuildTimer=setTimeout(rebuildLabels,90);
}
function rebuildLabels(){
 if(pinchState)return;
 const z=map.getZoom(), bounds=map.getBounds(),size=map.getSize();
 if(!size.x||!size.y)return;
 // On radar and warning screens the map may have resized after the navigation disappears.
 // All positions are measured in *current* Leaflet geographic coordinates.
 const minPriority=z<4.5?9:z<5.2?8:z<5.9?7:z<6.7?6:z<7.4?5:4;
 const newKey=[z.toFixed(1),bounds.getWest().toFixed(2),bounds.getSouth().toFixed(2),bounds.getEast().toFixed(2),bounds.getNorth().toFixed(2),size.x,size.y].join('/');
 if(newKey===labelKey && labelMarkers.length)return;
 labelKey=newKey;
 clearLabels();
 const occupied=[];
 const overlaps=(x,y,w,h)=>occupied.some(o=>x<o[0]+o[2]+7&&x+w>o[0]-7&&y<o[1]+o[3]+7&&y+h>o[1]-7);
 const occupy=(x,y,w,h)=>occupied.push([x,y,w,h]);
 const font=z<5?15:z<6?17:z<7?19:20;
 const candidates=CITIES.filter(c=>c[3]>=minPriority&&bounds.contains([c[1],c[2]])).sort((x,y)=>y[3]-x[3]);
 for(const c of candidates){
  const pt=map.latLngToContainerPoint([c[1],c[2]]);
  if(pt.x<15||pt.x>size.x-20||pt.y<135||pt.y>size.y-85)continue;
  const w=Math.ceil(c[0].length*font*.57)+20,h=font+12,x=pt.x+9,y=pt.y-h/2;
  if(x+w>size.x-8||overlaps(x,y,w,h))continue;
  const ic=L.divIcon({className:'gwc-geocity',html:`<span class="gwc-city-dot"></span><span class="gwc-geo-city-name">${c[0]}</span>`,iconSize:[w,h],iconAnchor:[-9,h/2]});
  labelMarkers.push(L.marker([c[1],c[2]],{icon:ic,interactive:false,keyboard:false,pane:'gwcLabelPane'}).addTo(map));
  occupy(x,y,w,h);
 }
 for(const [name,lat,lon] of STATES){
  if(!bounds.contains([lat,lon]))continue;
  const pt=map.latLngToContainerPoint([lat,lon]),w=45,h=31,x=pt.x-w/2,y=pt.y-h/2;
  if(pt.y<125||pt.y>size.y-85||x<0||x+w>size.x||overlaps(x,y,w,h))continue;
  if(z<5&&['RI','CT','NJ','DE','MD','MA','NH','VT'].includes(name))continue;
  const ic=L.divIcon({className:'gwc-geostate',html:`<span class="gwc-geo-state-name">${name}</span>`,iconSize:[w,h],iconAnchor:[w/2,h/2]});
  labelMarkers.push(L.marker([lat,lon],{icon:ic,interactive:false,keyboard:false,pane:'gwcLabelPane'}).addTo(map));
  occupy(x,y,w,h);
 }
}
function updateCountyVisibility(){
 const show=!!countyGeoJson && map.getZoom()>=6.1;
 if(countyOutlineLayer){
  if(show&&!map.hasLayer(countyOutlineLayer))countyOutlineLayer.addTo(map);
  if(!show&&map.hasLayer(countyOutlineLayer))map.removeLayer(countyOutlineLayer);
 }
}
const $=id=>document.getElementById(id);
// No zoom snapping or elastic rebound: both caused visible shifts on iPad pinch release.
// Pointer-centred touch zoom stays under the user's control after the first automatic focus.
const map=L.map('map',{
 zoomControl:false,attributionControl:true,preferCanvas:false,
 minZoom:3,maxZoom:11,zoomSnap:0,zoomDelta:.5,
 touchZoom:false,bounceAtZoomLimits:false,
 worldCopyJump:false,zoomAnimation:false,markerZoomAnimation:false,
 inertia:false,fadeAnimation:false,doubleClickZoom:false
}).fitBounds(US_BOUNDS,{animate:false});
L.control.zoom({position:'topright'}).addTo(map);
map.createPane('gwcLabelPane');
map.getPane('gwcLabelPane').style.zIndex='640';
map.getPane('gwcLabelPane').style.pointerEvents='none';
// Track *real* pointer/touch/wheel/keyboard use before Leaflet handles it.
// Do not use Leaflet's moveend here: programmatic fitBounds also emits it.
function markUserGesture(){
  gestureSerial++;
  gestureActive=true;
  if(gestureIdleTimer)clearTimeout(gestureIdleTimer);
  gestureIdleTimer=setTimeout(()=>{gestureActive=false;},550);
}
const mapElement=document.getElementById('map');
mapElement.addEventListener('pointerdown',markUserGesture,{passive:true,capture:true});
mapElement.addEventListener('touchstart',markUserGesture,{passive:true,capture:true});
mapElement.addEventListener('wheel',markUserGesture,{passive:true,capture:true});
mapElement.addEventListener('keydown',markUserGesture,{capture:true});
// V12: On iPad Safari Leaflet's native pinch temporarily CSS-transforms
// the polygon and marker panes and reconciles them on touchend. That looked
// like the map drifted off its geographic position then snapped back.
// We disable that native pinch and update the map camera and all geographic
// layers synchronously at the touch midpoint on every touchmove instead.
function touchMetrics(touches){
 const box=mapElement.getBoundingClientRect();
 const x1=touches[0].clientX-box.left, y1=touches[0].clientY-box.top;
 const x2=touches[1].clientX-box.left, y2=touches[1].clientY-box.top;
 return {mid:L.point((x1+x2)/2,(y1+y2)/2),distance:Math.max(1,Math.hypot(x2-x1,y2-y1))};
}
function beginPinch(e){
 if(e.touches.length<2||pinchState)return;
 markUserGesture();
 map.stop();
 map.dragging.disable();
 const m=touchMetrics(e.touches);
 pinchState={distance:m.distance, zoom:map.getZoom(), anchor:map.containerPointToLatLng(m.mid)};
 if(e.cancelable)e.preventDefault();
}
function movePinch(e){
 if(!pinchState){if(e.touches.length>=2)beginPinch(e);return;}
 if(e.touches.length<2)return;
 if(e.cancelable)e.preventDefault();
 const m=touchMetrics(e.touches);
 const zoom=Math.max(map.getMinZoom(),Math.min(map.getMaxZoom(),pinchState.zoom+Math.log2(m.distance/pinchState.distance)));
 // Keep the exact geographic location that started beneath the fingers
 // beneath the live midpoint. Formula is in projected Leaflet map pixels.
 const size=map.getSize();
 const centerPx=map.project(pinchState.anchor,zoom).add(size.divideBy(2)).subtract(m.mid);
 const center=map.unproject(centerPx,zoom);
 map.setView(center,zoom,{animate:false});
}
function endPinch(e){
 if(!pinchState)return;
 if(e.touches.length>=2){
  // Maintain continuity if one finger was replaced by another.
  const m=touchMetrics(e.touches);
  pinchState={distance:m.distance,zoom:map.getZoom(),anchor:map.containerPointToLatLng(m.mid)};
  return;
 }
 pinchState=null;
 map.dragging.enable();
 // Re-run decluttering only after the gesture. The markers themselves
 // stayed anchored to latitude/longitude throughout the gesture.
 renderLabels();
}
mapElement.addEventListener('touchstart',beginPinch,{passive:false,capture:true});
mapElement.addEventListener('touchmove',movePinch,{passive:false,capture:true});
mapElement.addEventListener('touchend',endPinch,{passive:true,capture:true});
mapElement.addEventListener('touchcancel',endPinch,{passive:true,capture:true});
// Older iOS Safari also emits non-standard gesture events.
for(const eventName of ['gesturestart','gesturechange','gestureend']){
 mapElement.addEventListener(eventName,e=>{if(e.cancelable)e.preventDefault();},{passive:false,capture:true});
}
function focusRiskNow(){
  if(gestureActive)return;
  if(lastFeatures.length)zoomToRisk(lastFeatures);
  else defaultView();
  renderLabels();
}

// Avoid endlessly recreating markers during gestures. Leaflet natively keeps
// markers at the same geographic location while the map moves or scales.
map.on('moveend zoomend resize',()=>{renderLabels();updateCountyVisibility()});
window.addEventListener('resize',()=>{map.invalidateSize({pan:false,animate:false});renderLabels();updateCountyVisibility()});
map.whenReady(()=>{map.invalidateSize({pan:false,animate:false});renderLabels();updateCountyVisibility()});
function loadStateOutlines(){
 fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
  .then(r=>{if(!r.ok)throw Error('State outline download failed');return r.json()})
  .then(j=>{
   stateOutlineGlowLayer=L.geoJSON(j,{style:{color:'#a9d7ff',weight:4.2,opacity:.18,fillOpacity:0},interactive:false});
   stateOutlineLayer=L.geoJSON(j,{style:{color:'#d7e3ee',weight:1.15,opacity:.82,fillOpacity:0},interactive:false});
   stateOutlineGlowLayer.addTo(map);
   stateOutlineLayer.addTo(map);
  })
  .catch(()=>{});
}
function loadCountyOutlines(){
 fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json')
  .then(r=>{if(!r.ok)throw Error('County download failed');return r.json()})
  .then(data=>{
    // A single shared mesh instead of thousands of SVG county polygons.
    countyGeoJson=topojson.mesh(data,data.objects.counties,(left,right)=>left!==right);
    const countyCanvas=L.canvas({padding:.08,tolerance:2});
    countyOutlineLayer=L.geoJSON(countyGeoJson,{renderer:countyCanvas,style:{color:'#b6c8db',weight:.65,opacity:.42,fillOpacity:0},interactive:false});
    updateCountyVisibility();
  }).catch(()=>{});
}
loadStateOutlines();
loadCountyOutlines();
function nav(){ $('days').innerHTML='';for(let d=1;d<=8;d++){let b=document.createElement('button');b.textContent='DAY '+d;b.className=d===day?'active':'';b.setAttribute('aria-pressed',d===day);b.onclick=()=>{day=d;type=LAYERS[d][type]?'cat' in LAYERS[d]?'cat':'prob':d<=3?'cat':'prob';nav();load()};$('days').append(b)}$('hazards').innerHTML='';for(const [key,txt] of Object.entries(TYPES)){const b=document.createElement('button');b.textContent=txt;b.disabled=!LAYERS[day][key];b.className=key===type?'active':'';b.setAttribute('aria-pressed',key===type);b.onclick=()=>{type=key;nav();load()};$('hazards').append(b)}}
function palette(){return type==='cat'?CATEGORY:type==='tor'?TORNADO:PROB}
function color(dn){let row=palette().find(e=>e[2]===dn);return row?row[1]:'#8fbbce'}
function makeLegend(){const rows=type==='cat'?CATEGORY:type==='tor'?TORNADO:type==='prob'&&day>=4?PROB.filter(x=>x[2]===15||x[2]===30):PROB;$('legend').replaceChildren(...rows.map(([label,col])=>{let node=document.createElement('div');node.className='legend-item';let swatch=document.createElement('i');swatch.className='swatch';swatch.style.background=col;let t=document.createElement('span');t.textContent=label;node.append(swatch,t);return node}))}
function showMessage(s){$('message').textContent=s;$('message').classList.toggle('show',!!s)}
function corners(geometry){let out=[];function walk(coords){if(!Array.isArray(coords))return;if(typeof coords[0]==='number'&&typeof coords[1]==='number'){out.push([coords[1],coords[0]]);return}coords.forEach(walk)}walk(geometry.coordinates);return out}
function pointInRing(x,y,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if(((a[1]>y)!=(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))inside=!inside}return inside}
function pointInPolygon(lon,lat,poly){if(!pointInRing(lon,lat,poly[0]))return false;for(let i=1;i<poly.length;i++)if(pointInRing(lon,lat,poly[i]))return false;return true}
function contains(geom,lon,lat){if(geom.type==='Polygon')return pointInPolygon(lon,lat,geom.coordinates);if(geom.type==='MultiPolygon')return geom.coordinates.some(p=>pointInPolygon(lon,lat,p));return false}
function featureRisk(f){let n=Number(f.properties?.dn);return Number.isFinite(n)?n:0}
function selectCities(){renderLabels()}
// Highest published risk drives the view: HIGH > MDT > ENH > SLGT > MRGL.
// We intentionally exclude broad thunderstorm contours from the automatic focus.
function zoomToRisk(features){
 const minimum=type==='cat'?3:day>=4?15:type==='tor'?2:5;
 const applicable=features.filter(f=>featureRisk(f)>=minimum);
 if(!applicable.length){defaultView();return false;}
 const highest=Math.max(...applicable.map(featureRisk));
 const tier=applicable.filter(f=>featureRisk(f)===highest);
 // A single multipolygon can contain two distant storms. Evaluate every
 // polygon component separately rather than fitting the whole nationwide extent.
 const pieces=[];
 for(const f of tier){
  const geom=f.geometry;
  if(!geom)continue;
  const polys=geom.type==='Polygon'?[geom.coordinates]:geom.type==='MultiPolygon'?geom.coordinates:[];
  for(const poly of polys){
   if(!poly?.length)continue;
   const exterior=poly[0];
   const pts=exterior.filter(v=>Array.isArray(v)&&Number.isFinite(v[0])&&Number.isFinite(v[1])&&v[0]>=-125&&v[0]<=-66&&v[1]>=24&&v[1]<=50);
   if(pts.length<3)continue;
   const bb=L.latLngBounds(pts.map(pt=>[pt[1],pt[0]]));
   const spanLat=bb.getNorth()-bb.getSouth(),spanLon=bb.getEast()-bb.getWest();
   if(spanLat<.025||spanLon<.025||spanLat>26||spanLon>48)continue;
   // Shoelace area (rough geographic adjustment) to favour the main contiguous zone.
   let area=0;
   for(let i=0,j=pts.length-1;i<pts.length;j=i++)area+=pts[j][0]*pts[i][1]-pts[i][0]*pts[j][1];
   area=Math.abs(area)*.5*Math.cos(bb.getCenter().lat*Math.PI/180);
   pieces.push({bb,area,center:bb.getCenter()});
  }
 }
 if(!pieces.length){defaultView();return false;}
 pieces.sort((a,b)=>b.area-a.area);
 const main=pieces[0];
 // Centre on the largest polygon of the highest risk, not far-away smaller patches.
 // Use the actual available map viewport so the map isn't accidentally fitted
 // behind the title or legend; clamp the frame for a broadcast-friendly focus.
 const bounds=main.bb.pad(.16);
 const fittedZoom=map.getBoundsZoom(bounds,false,[110,190]);
 const zoom=Math.max(map.getMinZoom(),Math.min(7.1,fittedZoom));
 // SINGLE deliberate camera move. No subsequent panInsideBounds/fitBounds.
 if(gestureActive)return false;
 map.stop();
 map.setView(main.center,zoom,{animate:false,reset:false});
 return true;
}

async function load({autoFit=true}={}){const focusSerial=gestureSerial;let myId=++requestId;if(activeController)activeController.abort();activeController=new AbortController();const signal=activeController.signal;const lid=LAYERS[day][type];$('title').textContent=`DAY ${day} ${TYPES[type]} OUTLOOK`;$('eyebrow').textContent='GLOBAL WEATHER CENTER  /  STORM PREDICTION CENTER';$('issue').textContent='Loading official NOAA data…';showMessage('');makeLegend();if(weatherLayer){map.removeLayer(weatherLayer);weatherLayer=null}if(labelsLayer){map.removeLayer(labelsLayer);labelsLayer=null}const url=`${BASE}/${lid}/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson&_=${Date.now()}`;try{const res=await fetch(url,{signal,cache:'no-store'});if(!res.ok)throw Error('NOAA service returned HTTP '+res.status);const json=await res.json();if(myId!==requestId)return;if(json.error)throw Error(json.error.message||'NOAA service error');if(!Array.isArray(json.features))throw Error('Unexpected response from NOAA');const features=json.features.filter(f=>f&&f.geometry&&f.properties);const dates=features.map(f=>f.properties?.issue||f.properties?.valid||f.properties?.idp_filedate).filter(Boolean);let t=dates[0];const formatDate=v=>{if(v==null)return'';if(typeof v==='number'){let d=new Date(v);return Number.isNaN(d.getTime())?'':d.toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'}let ms=Date.parse(v);return Number.isNaN(ms)?String(v):new Date(ms).toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'};
$('issue').textContent='NOAA / SPC'+(t?'  •  '+formatDate(t):'  •  Current published outlook')+'  •  Retrieved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+' local';
if(features.length===0){lastFeatures=[];if(autoFit && gestureSerial===focusSerial && !gestureActive && (!document.body.dataset.mode||document.body.dataset.mode==='outlooks'))defaultView();renderLabels();return}
const sorted=[...features].sort((a,b)=>featureRisk(a)-featureRisk(b));weatherLayer=L.geoJSON({type:'FeatureCollection',features:sorted},{style:f=>({color:color(featureRisk(f)),weight:1.9,opacity:1,fillColor:color(featureRisk(f)),fillOpacity:0.70,className:'gwc-risk-polygon'}),interactive:false}).addTo(map);if(document.body.dataset.mode&&document.body.dataset.mode!=='outlooks')map.removeLayer(weatherLayer);
// Zoom only to a meaningful, land-based threat; otherwise default to the US.
if(autoFit && gestureSerial===focusSerial && !gestureActive && (!document.body.dataset.mode||document.body.dataset.mode==='outlooks'))zoomToRisk(features);
lastFeatures=features;renderLabels();
}catch(err){if(signal.aborted||myId!==requestId)return;$('issue').textContent='Unable to load live NOAA data';lastFeatures=[];if(autoFit && gestureSerial===focusSerial && !gestureActive && (!document.body.dataset.mode||document.body.dataset.mode==='outlooks'))defaultView();renderLabels();showMessage('Official SPC map data could not be loaded. Check your connection or try Refresh. No forecast shapes are displayed rather than showing made-up risks. '+err.message)}}
$('refresh').onclick=()=>load({autoFit:false});$('focus').onclick=()=>{gestureActive=false;focusRiskNow()};nav();load();setInterval(()=>{if(document.visibilityState==='visible')load({autoFit:false})},10*60*1000);
