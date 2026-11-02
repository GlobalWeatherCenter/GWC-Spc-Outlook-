/* Global Weather Center — live polygons directly from NOAA/NWS SPC REST service */
const BASE='https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/FeatureServer';
const LAYERS={1:{cat:1,tor:3,wind:7,hail:5},2:{cat:9,tor:11,wind:15,hail:13},3:{cat:17,prob:19},4:{prob:21},5:{prob:22},6:{prob:23},7:{prob:24},8:{prob:25}};
const TYPES={cat:'CATEGORICAL',tor:'TORNADO',wind:'WIND',hail:'HAIL',prob:'SEVERE PROBABILITY'};
const CATEGORY=[['TSTM','#7edb76',2],['MRGL','#138d1d',3],['SLGT','#ffd400',4],['ENH','#ff8b00',5],['MDT','#d80b23',6],['HIGH','#ec35c2',8]];
const PROB=[['2%','#008b14',2],['5%','#986a29',5],['10%','#e8cc26',10],['15%','#f7ce12',15],['30%','#fc7020',30],['45%','#db282d',45],['60%','#b640a5',60],['75%','#985eb7',75],['90%','#6a3da6',90]];
const CITIES=[
['New York',40.713,-74.006,10],['Los Angeles',34.052,-118.244,10],['Chicago',41.878,-87.63,10],['Houston',29.76,-95.37,10],['Phoenix',33.448,-112.074,10],['Philadelphia',39.952,-75.165,9],['San Antonio',29.424,-98.494,9],['San Diego',32.716,-117.161,9],['Dallas',32.777,-96.797,10],['Austin',30.267,-97.743,9],['Jacksonville',30.332,-81.656,8],['Fort Worth',32.755,-97.33,9],['Columbus',39.962,-83,8],['Indianapolis',39.768,-86.158,8],['Charlotte',35.227,-80.843,8],['San Francisco',37.775,-122.419,8],['Seattle',47.606,-122.332,8],['Denver',39.739,-104.99,9],['Washington DC',38.907,-77.037,9],['Nashville',36.163,-86.781,9],['Oklahoma City',35.468,-97.516,10],['El Paso',31.761,-106.485,8],['Detroit',42.331,-83.046,9],['Memphis',35.15,-90.049,9],['Louisville',38.253,-85.759,9],['Baltimore',39.29,-76.612,9],['Boston',42.36,-71.059,9],['Portland',45.515,-122.679,8],['Las Vegas',36.17,-115.14,9],['Milwaukee',43.038,-87.906,8],['Albuquerque',35.085,-106.65,8],['Tucson',32.222,-110.975,8],['Fresno',36.737,-119.788,7],['Sacramento',38.581,-121.494,8],['Kansas City',39.1,-94.579,9],['Atlanta',33.749,-84.388,9],['Miami',25.762,-80.192,9],['Tampa',27.951,-82.458,8],['Orlando',28.538,-81.379,8],['Pittsburgh',40.441,-79.996,8],['Cleveland',41.5,-81.694,8],['Cincinnati',39.103,-84.512,8],['St. Louis',38.627,-90.199,9],['Minneapolis',44.978,-93.265,9],['New Orleans',29.951,-90.072,8],['Tulsa',36.154,-95.993,9],['Wichita',37.687,-97.33,9],['Omaha',41.256,-95.934,9],['Lincoln',40.814,-96.703,7],['Topeka',39.048,-95.678,7],['Amarillo',35.222,-101.831,8],['Lubbock',33.578,-101.855,8],['Midland',31.997,-102.078,7],['Abilene',32.449,-99.733,7],['Waco',31.549,-97.147,7],['San Angelo',31.464,-100.437,7],['Wichita Falls',33.914,-98.493,7],['Lawton',34.604,-98.395,7],['Norman',35.223,-97.439,7],['Stillwater',36.116,-97.058,7],['Enid',36.396,-97.879,7],['Dodge City',37.753,-100.018,7],['Salina',38.84,-97.611,7],['Emporia',38.404,-96.182,6],['Little Rock',34.746,-92.289,8],['Fayetteville',36.063,-94.158,7],['Springfield',37.209,-93.292,7],['Columbia',38.952,-92.334,7],['Des Moines',41.586,-93.625,8],['Sioux Falls',43.547,-96.731,7],['Rapid City',44.081,-103.231,7],['Bismarck',46.808,-100.783,7],['Fargo',46.877,-96.79,7],['Grand Forks',47.925,-97.033,6],['Duluth',46.786,-92.1,7],['Rochester',44.012,-92.48,7],['Madison',43.073,-89.401,7],['Green Bay',44.514,-88.02,7],['Peoria',40.694,-89.589,7],['Springfield IL',39.782,-89.65,7],['Evansville',37.972,-87.571,7],['Bowling Green',36.968,-86.48,7],['Chattanooga',35.046,-85.31,7],['Knoxville',35.961,-83.921,7],['Huntsville',34.73,-86.586,7],['Birmingham',33.519,-86.811,8],['Montgomery',32.367,-86.3,7],['Mobile',30.695,-88.04,7],['Jackson',32.299,-90.185,7],['Hattiesburg',31.327,-89.29,6],['Baton Rouge',30.451,-91.187,7],['Shreveport',32.525,-93.75,7],['Monroe',32.509,-92.119,6],['Beaumont',30.08,-94.127,7],['Corpus Christi',27.8,-97.396,7],['Laredo',27.531,-99.507,7],['McAllen',26.203,-98.23,7],['Tyler',32.352,-95.301,7],['Longview',32.501,-94.74,7],['Texarkana',33.426,-94.048,6],['Colorado Springs',38.834,-104.821,7],['Pueblo',38.254,-104.609,6],['Cheyenne',41.14,-104.82,7],['Casper',42.85,-106.326,6],['Boise',43.616,-116.202,8],['Salt Lake City',40.76,-111.891,8],['Spokane',47.659,-117.426,7],['Billings',45.783,-108.501,7],['Missoula',46.872,-113.994,6],['Reno',39.53,-119.814,7],['Bakersfield',35.373,-119.018,7],['Fresno',36.737,-119.788,7],['Savannah',32.08,-81.09,7],['Columbia SC',34,-81.034,7],['Charleston',32.776,-79.931,7],['Raleigh',35.779,-78.638,8],['Greensboro',36.073,-79.792,7],['Richmond',37.541,-77.436,7],['Norfolk',36.85,-76.286,7],['Roanoke',37.271,-79.942,7],['Buffalo',42.886,-78.878,7],['Syracuse',43.048,-76.147,7],['Albany',42.652,-73.757,7]
];
let day=1,type='cat',weatherLayer=null,labelsLayer=null,stateLabelsLayer=null,activeController=null,requestId=0;
const US_BOUNDS=[[24.5,-125],[49.6,-66.5]];
const STATES=[['WA',47.4,-120.7],['OR',43.9,-120.5],['CA',36.8,-119.4],['NV',39.2,-116.7],['ID',44.3,-114.4],['MT',47,-109.6],['WY',43,-107.6],['UT',39.3,-111.8],['AZ',34.2,-111.7],['NM',34.5,-106],['CO',39,-105.5],['ND',47.5,-100.5],['SD',44.4,-100.2],['NE',41.6,-99.7],['KS',38.5,-98.3],['OK',35.6,-97.3],['TX',31.1,-99.1],['MN',46,-94.5],['IA',42.2,-93.5],['MO',38.5,-92.4],['AR',34.8,-92.3],['LA',31,-92.3],['WI',44.6,-89.8],['IL',40,-89.1],['MI',44.3,-85.5],['IN',40,-86.2],['OH',40.3,-82.8],['KY',37.7,-85.3],['TN',35.8,-86],['MS',32.6,-89.8],['AL',32.8,-86.8],['GA',32.5,-83.4],['FL',28.1,-82],['SC',33.8,-80.9],['NC',35.6,-79.9],['VA',37.6,-78.9],['WV',38.7,-80.5],['PA',40.9,-77.8],['NY',42.7,-75.5],['VT',44,-72.7],['NH',43.8,-71.6],['ME',45.2,-69.1],['MA',42.3,-71.7],['CT',41.6,-72.7],['RI',41.5,-71.5],['NJ',40.1,-74.5],['DE',39,-75.4],['MD',39,-76.7]];
function defaultView(){map.stop();map.fitBounds(US_BOUNDS,{animate:false,padding:[18,18]});}
function paintStateLabels(){if(stateLabelsLayer)map.removeLayer(stateLabelsLayer);stateLabelsLayer=L.layerGroup().addTo(map);const zoom=map.getZoom();for(const [abbr,lat,lon] of STATES){if(zoom<4.1&&['RI','CT','NJ','DE','MD','MA','NH','VT','WV'].includes(abbr))continue;L.marker([lat,lon],{interactive:false,keyboard:false,icon:L.divIcon({className:'state-abbr',html:abbr,iconSize:[30,16],iconAnchor:[15,8]})}).addTo(stateLabelsLayer)}}
const $=id=>document.getElementById(id);
const map=L.map('map',{zoomControl:false,attributionControl:true,preferCanvas:true,minZoom:3,maxZoom:11,zoomSnap:.25,worldCopyJump:false}).fitBounds(US_BOUNDS);
L.control.zoom({position:'topright'}).addTo(map);
// No third-party basemap tiles: the dark background is supplied by CSS,
// with state boundaries drawn below. This avoids API keys/watermarks.
// State outlines from an independent, simplified, public GeoJSON dataset.
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json').then(r=>{if(!r.ok)throw Error('State outlines unavailable');return r.json()}).then(j=>L.geoJSON(j,{style:{color:'#cbd4df',weight:1.05,opacity:.74,fillOpacity:0},interactive:false}).addTo(map)).catch(()=>{ $('message').title='State borders unavailable; forecast polygons remain official NOAA data.';});
map.on('zoomend',paintStateLabels);paintStateLabels();
function nav(){ $('days').innerHTML='';for(let d=1;d<=8;d++){let b=document.createElement('button');b.textContent='DAY '+d;b.className=d===day?'active':'';b.setAttribute('aria-pressed',d===day);b.onclick=()=>{day=d;type=LAYERS[d][type]?'cat' in LAYERS[d]?'cat':'prob':d<=3?'cat':'prob';nav();load()};$('days').append(b)}$('hazards').innerHTML='';for(const [key,txt] of Object.entries(TYPES)){const b=document.createElement('button');b.textContent=txt;b.disabled=!LAYERS[day][key];b.className=key===type?'active':'';b.setAttribute('aria-pressed',key===type);b.onclick=()=>{type=key;nav();load()};$('hazards').append(b)}}
function palette(){return type==='cat'?CATEGORY:PROB}
function color(dn){let row=palette().find(e=>e[2]===dn);return row?row[1]:'#8fbbce'}
function makeLegend(){const rows=type==='cat'?CATEGORY:type==='prob'&&day>=4?PROB.filter(x=>x[2]===15||x[2]===30):PROB;$('legend').replaceChildren(...rows.map(([label,col])=>{let node=document.createElement('div');node.className='legend-item';let swatch=document.createElement('i');swatch.className='swatch';swatch.style.background=col;let t=document.createElement('span');t.textContent=label;node.append(swatch,t);return node}))}
function showMessage(s){$('message').textContent=s;$('message').classList.toggle('show',!!s)}
function corners(geometry){let out=[];function walk(coords){if(!Array.isArray(coords))return;if(typeof coords[0]==='number'&&typeof coords[1]==='number'){out.push([coords[1],coords[0]]);return}coords.forEach(walk)}walk(geometry.coordinates);return out}
function pointInRing(x,y,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if(((a[1]>y)!=(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))inside=!inside}return inside}
function pointInPolygon(lon,lat,poly){if(!pointInRing(lon,lat,poly[0]))return false;for(let i=1;i<poly.length;i++)if(pointInRing(lon,lat,poly[i]))return false;return true}
function contains(geom,lon,lat){if(geom.type==='Polygon')return pointInPolygon(lon,lat,geom.coordinates);if(geom.type==='MultiPolygon')return geom.coordinates.some(p=>pointInPolygon(lon,lat,p));return false}
function featureRisk(f){let n=Number(f.properties?.dn);return Number.isFinite(n)?n:0}
function selectCities(features){
 if(labelsLayer)map.removeLayer(labelsLayer);labelsLayer=L.layerGroup().addTo(map);
 const bounds=map.getBounds(), candidates=[];
 for(const c of CITIES){const ll=[c[1],c[2]];if(!bounds.pad(-.035).contains(ll))continue;
   let highest=0;for(const f of features){if(contains(f.geometry,c[2],c[1]))highest=Math.max(highest,featureRisk(f))}
   candidates.push({city:c,score:c[3]+highest*2.4});
 }
 candidates.sort((a,b)=>b.score-a.score);
 const occupied=[]; const limit=map.getZoom()<5?15:25;
 for(const item of candidates){const c=item.city,p=map.latLngToContainerPoint([c[1],c[2]]);
   const width=c[0].length*7+19;
   if(occupied.some(q=>Math.abs(q.x-p.x)<(q.width+width)/2+5&&Math.abs(q.y-p.y)<23))continue;
   occupied.push({x:p.x+width/2,y:p.y,width});
   const marker=L.marker([c[1],c[2]],{icon:L.divIcon({className:'city-marker',html:'<span class="city-dot"></span><span class="city-text">'+c[0]+'</span>',iconSize:[width,18],iconAnchor:[4,9]}),interactive:false,keyboard:false});
   marker.addTo(labelsLayer);if(occupied.length>=limit)break;
 }
}
function zoomToRisk(features){
 // Never use off-shore/oceanic polygons as a map extent. If no meaningful
 // inland outlook is outlined, display the contiguous United States.
 const minRisk=type==='cat'?3:day>=4?15:5;
 const candidates=features.filter(f=>featureRisk(f)>=minRisk);
 if(!candidates.length){defaultView();return false}
 const ranked=candidates.map(f=>({f,rank:featureRisk(f),pts:corners(f.geometry).filter(p=>p[0]>=24&&p[0]<=50&&p[1]>=-126&&p[1]<=-66)})).filter(x=>x.pts.length>=3);
 if(!ranked.length){defaultView();return false}
 const maxRank=Math.max(...ranked.map(x=>x.rank));
 const primary=ranked.filter(x=>x.rank===maxRank);
 // Prefer the main risk area; an offshore/huge outer polygon must not control zoom.
 const choice=primary.sort((a,b)=>b.pts.length-a.pts.length)[0];
 const raw=L.latLngBounds(choice.pts);if(!raw.isValid()){defaultView();return false}
 const latSpan=raw.getNorth()-raw.getSouth(),lonSpan=raw.getEast()-raw.getWest();
 if(latSpan>22||lonSpan>36||latSpan<.01||lonSpan<.01){defaultView();return false}
 map.stop();map.fitBounds(raw.pad(.45),{paddingTopLeft:[55,115],paddingBottomRight:[40,90],maxZoom:7,animate:false});
 return true;
}
async function load(){let myId=++requestId;if(activeController)activeController.abort();activeController=new AbortController();const signal=activeController.signal;const lid=LAYERS[day][type];$('title').textContent=`DAY ${day} ${TYPES[type]} OUTLOOK`;$('eyebrow').textContent='GLOBAL WEATHER CENTER  /  STORM PREDICTION CENTER';$('issue').textContent='Loading official NOAA data…';showMessage('');makeLegend();if(weatherLayer){map.removeLayer(weatherLayer);weatherLayer=null}if(labelsLayer){map.removeLayer(labelsLayer);labelsLayer=null}const url=`${BASE}/${lid}/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson&_=${Date.now()}`;try{const res=await fetch(url,{signal,cache:'no-store'});if(!res.ok)throw Error('NOAA service returned HTTP '+res.status);const json=await res.json();if(myId!==requestId)return;if(json.error)throw Error(json.error.message||'NOAA service error');if(!Array.isArray(json.features))throw Error('Unexpected response from NOAA');const features=json.features.filter(f=>f&&f.geometry&&f.properties);const dates=features.map(f=>f.properties?.issue||f.properties?.valid||f.properties?.idp_filedate).filter(Boolean);let t=dates[0];const formatDate=v=>{if(v==null)return'';if(typeof v==='number'){let d=new Date(v);return Number.isNaN(d.getTime())?'':d.toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'}let ms=Date.parse(v);return Number.isNaN(ms)?String(v):new Date(ms).toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'};
$('issue').textContent='NOAA / SPC'+(t?'  •  '+formatDate(t):'  •  Current published outlook')+'  •  Retrieved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+' local';
if(features.length===0){defaultView();selectCities([]);showMessage('No outlined risk area for this outlook. Showing the United States.');return}
const sorted=[...features].sort((a,b)=>featureRisk(a)-featureRisk(b));weatherLayer=L.geoJSON({type:'FeatureCollection',features:sorted},{style:f=>({color:color(featureRisk(f)),weight:1.7,opacity:1,fillColor:color(featureRisk(f)),fillOpacity:.78}),interactive:false}).addTo(map);
// Zoom only to a meaningful, land-based threat; otherwise default to the US.
const hasRisk=zoomToRisk(features);
if(!hasRisk)showMessage('No focused severe-risk area for this outlook — showing the United States.');
selectCities(hasRisk?features:[]);
}catch(err){if(signal.aborted||myId!==requestId)return;$('issue').textContent='Unable to load live NOAA data';defaultView();selectCities([]);showMessage('Official SPC map data could not be loaded. Check your connection or try Refresh. No forecast shapes are displayed rather than showing made-up risks. '+err.message)}}
$('refresh').onclick=load;nav();load();setInterval(()=>{if(document.visibilityState==='visible')load()},10*60*1000);
