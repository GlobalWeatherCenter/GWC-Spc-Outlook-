/* Global Weather Center — live polygons directly from NOAA/NWS SPC REST service */
const BASE='https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/FeatureServer';
const LAYERS={1:{cat:1,tor:3,wind:7,hail:5},2:{cat:9,tor:11,wind:15,hail:13},3:{cat:17,prob:19},4:{prob:21},5:{prob:22},6:{prob:23},7:{prob:24},8:{prob:25}};
const TYPES={cat:'CATEGORICAL',tor:'TORNADO',wind:'WIND',hail:'HAIL',prob:'SEVERE PROBABILITY'};
const CATEGORY=[['TSTM','#7edb76',2],['MRGL','#138d1d',3],['SLGT','#ffd400',4],['ENH','#ff8b00',5],['MDT','#d80b23',6],['HIGH','#ec35c2',8]];
const PROB=[['2%','#008b14',2],['5%','#986a29',5],['10%','#e8cc26',10],['15%','#f7ce12',15],['30%','#fc7020',30],['45%','#db282d',45],['60%','#b640a5',60],['75%','#985eb7',75],['90%','#6a3da6',90]];
const CITIES=[
['New York',40.713,-74.006,10],['Los Angeles',34.052,-118.244,10],['Chicago',41.878,-87.63,10],['Houston',29.76,-95.37,10],['Phoenix',33.448,-112.074,10],['Philadelphia',39.952,-75.165,9],['San Antonio',29.424,-98.494,9],['San Diego',32.716,-117.161,9],['Dallas',32.777,-96.797,10],['Austin',30.267,-97.743,9],['Jacksonville',30.332,-81.656,8],['Fort Worth',32.755,-97.33,9],['Columbus',39.962,-83,8],['Indianapolis',39.768,-86.158,8],['Charlotte',35.227,-80.843,8],['San Francisco',37.775,-122.419,8],['Seattle',47.606,-122.332,8],['Denver',39.739,-104.99,9],['Washington DC',38.907,-77.037,9],['Nashville',36.163,-86.781,9],['Oklahoma City',35.468,-97.516,10],['El Paso',31.761,-106.485,8],['Detroit',42.331,-83.046,9],['Memphis',35.15,-90.049,9],['Louisville',38.253,-85.759,9],['Baltimore',39.29,-76.612,9],['Boston',42.36,-71.059,9],['Portland',45.515,-122.679,8],['Las Vegas',36.17,-115.14,9],['Milwaukee',43.038,-87.906,8],['Albuquerque',35.085,-106.65,8],['Tucson',32.222,-110.975,8],['Fresno',36.737,-119.788,7],['Sacramento',38.581,-121.494,8],['Kansas City',39.1,-94.579,9],['Atlanta',33.749,-84.388,9],['Miami',25.762,-80.192,9],['Tampa',27.951,-82.458,8],['Orlando',28.538,-81.379,8],['Pittsburgh',40.441,-79.996,8],['Cleveland',41.5,-81.694,8],['Cincinnati',39.103,-84.512,8],['St. Louis',38.627,-90.199,9],['Minneapolis',44.978,-93.265,9],['New Orleans',29.951,-90.072,8],['Tulsa',36.154,-95.993,9],['Wichita',37.687,-97.33,9],['Omaha',41.256,-95.934,9],['Lincoln',40.814,-96.703,7],['Topeka',39.048,-95.678,7],['Amarillo',35.222,-101.831,8],['Lubbock',33.578,-101.855,8],['Midland',31.997,-102.078,7],['Abilene',32.449,-99.733,7],['Waco',31.549,-97.147,7],['San Angelo',31.464,-100.437,7],['Wichita Falls',33.914,-98.493,7],['Lawton',34.604,-98.395,7],['Norman',35.223,-97.439,7],['Stillwater',36.116,-97.058,7],['Enid',36.396,-97.879,7],['Dodge City',37.753,-100.018,7],['Salina',38.84,-97.611,7],['Emporia',38.404,-96.182,6],['Little Rock',34.746,-92.289,8],['Fayetteville',36.063,-94.158,7],['Springfield',37.209,-93.292,7],['Columbia',38.952,-92.334,7],['Des Moines',41.586,-93.625,8],['Sioux Falls',43.547,-96.731,7],['Rapid City',44.081,-103.231,7],['Bismarck',46.808,-100.783,7],['Fargo',46.877,-96.79,7],['Grand Forks',47.925,-97.033,6],['Duluth',46.786,-92.1,7],['Rochester',44.012,-92.48,7],['Madison',43.073,-89.401,7],['Green Bay',44.514,-88.02,7],['Peoria',40.694,-89.589,7],['Springfield IL',39.782,-89.65,7],['Evansville',37.972,-87.571,7],['Bowling Green',36.968,-86.48,7],['Chattanooga',35.046,-85.31,7],['Knoxville',35.961,-83.921,7],['Huntsville',34.73,-86.586,7],['Birmingham',33.519,-86.811,8],['Montgomery',32.367,-86.3,7],['Mobile',30.695,-88.04,7],['Jackson',32.299,-90.185,7],['Hattiesburg',31.327,-89.29,6],['Baton Rouge',30.451,-91.187,7],['Shreveport',32.525,-93.75,7],['Monroe',32.509,-92.119,6],['Beaumont',30.08,-94.127,7],['Corpus Christi',27.8,-97.396,7],['Laredo',27.531,-99.507,7],['McAllen',26.203,-98.23,7],['Tyler',32.352,-95.301,7],['Longview',32.501,-94.74,7],['Texarkana',33.426,-94.048,6],['Colorado Springs',38.834,-104.821,7],['Pueblo',38.254,-104.609,6],['Cheyenne',41.14,-104.82,7],['Casper',42.85,-106.326,6],['Boise',43.616,-116.202,8],['Salt Lake City',40.76,-111.891,8],['Spokane',47.659,-117.426,7],['Billings',45.783,-108.501,7],['Missoula',46.872,-113.994,6],['Reno',39.53,-119.814,7],['Bakersfield',35.373,-119.018,7],['Fresno',36.737,-119.788,7],['Savannah',32.08,-81.09,7],['Columbia SC',34,-81.034,7],['Charleston',32.776,-79.931,7],['Raleigh',35.779,-78.638,8],['Greensboro',36.073,-79.792,7],['Richmond',37.541,-77.436,7],['Norfolk',36.85,-76.286,7],['Roanoke',37.271,-79.942,7],['Buffalo',42.886,-78.878,7],['Syracuse',43.048,-76.147,7],['Albany',42.652,-73.757,7]
];
let day=1,type='cat',weatherLayer=null,labelsLayer=null,stateLabelsLayer=null,activeController=null,requestId=0,lastFeatures=[];
const US_BOUNDS=[[24.5,-125],[49.6,-66.5]];
const STATES=[['WA',47.4,-120.7],['OR',43.9,-120.5],['CA',36.8,-119.4],['NV',39.2,-116.7],['ID',44.3,-114.4],['MT',47,-109.6],['WY',43,-107.6],['UT',39.3,-111.8],['AZ',34.2,-111.7],['NM',34.5,-106],['CO',39,-105.5],['ND',47.5,-100.5],['SD',44.4,-100.2],['NE',41.6,-99.7],['KS',38.5,-98.3],['OK',35.6,-97.3],['TX',31.1,-99.1],['MN',46,-94.5],['IA',42.2,-93.5],['MO',38.5,-92.4],['AR',34.8,-92.3],['LA',31,-92.3],['WI',44.6,-89.8],['IL',40,-89.1],['MI',44.3,-85.5],['IN',40,-86.2],['OH',40.3,-82.8],['KY',37.7,-85.3],['TN',35.8,-86],['MS',32.6,-89.8],['AL',32.8,-86.8],['GA',32.5,-83.4],['FL',28.1,-82],['SC',33.8,-80.9],['NC',35.6,-79.9],['VA',37.6,-78.9],['WV',38.7,-80.5],['PA',40.9,-77.8],['NY',42.7,-75.5],['VT',44,-72.7],['NH',43.8,-71.6],['ME',45.2,-69.1],['MA',42.3,-71.7],['CT',41.6,-72.7],['RI',41.5,-71.5],['NJ',40.1,-74.5],['DE',39,-75.4],['MD',39,-76.7]];
function defaultView(){map.stop();map.fitBounds(US_BOUNDS,{animate:false,padding:[18,18]});}
// Labels are rendered in a single screen-positioned SVG overlay, independent
// of Leaflet marker panes. This prevents pane/layer ordering hiding labels.
let labelSvg;
function renderLabels(){
 if(!labelSvg)return;
 const w=map.getSize().x,h=map.getSize().y;
 labelSvg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 labelSvg.replaceChildren();
 const NS='http://www.w3.org/2000/svg';
 const el=(tag,attrs,parent=labelSvg)=>{let n=document.createElementNS(NS,tag);for(let [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.appendChild(n);return n};
 const shadow={'paint-order':'stroke','stroke':'#050912','stroke-width':'5','stroke-linejoin':'round'};
 const occupied=[];
 const overlap=(x,y,width,height)=>occupied.some(r=>Math.abs(r.x-x)<(r.w+width)/2+7&&Math.abs(r.y-y)<(r.h+height)/2+5);
 for(let [abbr,lat,lon] of STATES){
  const q=map.latLngToContainerPoint([lat,lon]);if(q.x<20||q.x>w-20||q.y<85||q.y>h-90)continue;
  if(map.getZoom()<4.5&&['RI','CT','NJ','DE','MD','MA','NH','VT','WV'].includes(abbr))continue;
  el('text',{x:q.x,y:q.y,'text-anchor':'middle','dominant-baseline':'middle',fill:'#dce5f0','font-size':map.getZoom()<4.5?'19':'24','font-family':'Arial, sans-serif','font-weight':'900',...shadow}).textContent=abbr;
  occupied.push({x:q.x,y:q.y,w:38,h:27});
 }
 const visible=CITIES.map(c=>({c,p:map.latLngToContainerPoint([c[1],c[2]])})).filter(o=>o.p.x>20&&o.p.x<w-30&&o.p.y>105&&o.p.y<h-105);
 visible.sort((a,b)=>b.c[3]-a.c[3]);
 const font=map.getZoom()<4.5?16:20;let count=0;
 for(let {c,p} of visible){
  const width=c[0].length*font*.56+14,x=p.x+width/2+9;
  if(p.x+width>w-12||overlap(x,p.y,width,24))continue;
  el('circle',{cx:p.x,cy:p.y,r:3.7,fill:'#fff',stroke:'#080e16','stroke-width':1.5});
  el('text',{x:p.x+9,y:p.y+1,'dominant-baseline':'middle',fill:'#fff','font-size':font,'font-family':'Arial, sans-serif','font-weight':'800',...shadow}).textContent=c[0];
  occupied.push({x,y:p.y,w:width,h:25});
  if(++count>= (map.getZoom()<4.5?35:75))break;
 }
 const stats=$('label-count');if(stats)stats.textContent=`${STATES.length} states · ${count} cities available`;
}
const $=id=>document.getElementById(id);
const map=L.map('map',{zoomControl:false,attributionControl:true,preferCanvas:true,minZoom:3,maxZoom:11,zoomSnap:.25,worldCopyJump:false}).fitBounds(US_BOUNDS);
L.control.zoom({position:'topright'}).addTo(map);
// SVG is above the polygons, but below the title and legend.
labelSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
labelSvg.id='gwc-map-labels';labelSvg.setAttribute('aria-hidden','true');
$('map').parentElement.appendChild(labelSvg);
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
 .then(r=>{if(!r.ok)throw Error('State outline download failed');return r.json()})
 .then(j=>L.geoJSON(j,{style:{color:'#d0d8e4',weight:1.1,opacity:.78,fillOpacity:0},interactive:false}).addTo(map))
 .catch(()=>{});
map.on('moveend zoomend resize',renderLabels);
map.whenReady(()=>{map.invalidateSize();renderLabels()});
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
function selectCities(){renderLabels()}
function zoomToRisk(features){
 const minimum=type==='cat'?3:day>=4?15:5;
 const qualified=features.filter(f=>featureRisk(f)>=minimum);
 if(!qualified.length){defaultView();return false}
 const top=Math.max(...qualified.map(featureRisk));
 const all=qualified.filter(f=>featureRisk(f)===top);
 const groups=[];
 for(const f of all){
  const coords=corners(f.geometry).filter(p=>p[0]>24&&p[0]<50&&p[1]>-125&&p[1]<-66);
  if(coords.length<3)continue;
  const bb=L.latLngBounds(coords);const lat=bb.getNorth()-bb.getSouth(),lon=bb.getEast()-bb.getWest();
  if(lat<.08||lon<.08||lat>22||lon>38)continue;
  groups.push({bb,area:lat*lon});
 }
 if(!groups.length){defaultView();return false}
 // Main connected risk area, not a nationwide thunderstorm outer contour.
 groups.sort((a,b)=>b.area-a.area);
 let bb=groups[0].bb;
 // If other same-tier areas are close, include them, without zooming into oceans.
 for(const g of groups.slice(1)){if(g.area>groups[0].area*.3){const combined=L.latLngBounds(bb).extend(g.bb);
  if(combined.getEast()-combined.getWest()<30&&combined.getNorth()-combined.getSouth()<19)bb=combined;}}
 map.stop();map.fitBounds(bb.pad(.40),{animate:false,maxZoom:6.7,paddingTopLeft:[100,130],paddingBottomRight:[70,100]});
 // Prevent Leaflet fitBounds pushing beyond reasonable CONUS view.
 map.panInsideBounds(US_BOUNDS,{animate:false});
 return true;
}
async function load(){let myId=++requestId;if(activeController)activeController.abort();activeController=new AbortController();const signal=activeController.signal;const lid=LAYERS[day][type];$('title').textContent=`DAY ${day} ${TYPES[type]} OUTLOOK`;$('eyebrow').textContent='GLOBAL WEATHER CENTER  /  STORM PREDICTION CENTER';$('issue').textContent='Loading official NOAA data…';showMessage('');makeLegend();if(weatherLayer){map.removeLayer(weatherLayer);weatherLayer=null}if(labelsLayer){map.removeLayer(labelsLayer);labelsLayer=null}const url=`${BASE}/${lid}/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson&_=${Date.now()}`;try{const res=await fetch(url,{signal,cache:'no-store'});if(!res.ok)throw Error('NOAA service returned HTTP '+res.status);const json=await res.json();if(myId!==requestId)return;if(json.error)throw Error(json.error.message||'NOAA service error');if(!Array.isArray(json.features))throw Error('Unexpected response from NOAA');const features=json.features.filter(f=>f&&f.geometry&&f.properties);const dates=features.map(f=>f.properties?.issue||f.properties?.valid||f.properties?.idp_filedate).filter(Boolean);let t=dates[0];const formatDate=v=>{if(v==null)return'';if(typeof v==='number'){let d=new Date(v);return Number.isNaN(d.getTime())?'':d.toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'}let ms=Date.parse(v);return Number.isNaN(ms)?String(v):new Date(ms).toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC'};
$('issue').textContent='NOAA / SPC'+(t?'  •  '+formatDate(t):'  •  Current published outlook')+'  •  Retrieved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+' local';
if(features.length===0){lastFeatures=[];defaultView();renderLabels();return}
const sorted=[...features].sort((a,b)=>featureRisk(a)-featureRisk(b));weatherLayer=L.geoJSON({type:'FeatureCollection',features:sorted},{style:f=>({color:color(featureRisk(f)),weight:1.7,opacity:1,fillColor:color(featureRisk(f)),fillOpacity:.78}),interactive:false}).addTo(map);
// Zoom only to a meaningful, land-based threat; otherwise default to the US.
zoomToRisk(features);
lastFeatures=features;renderLabels();
}catch(err){if(signal.aborted||myId!==requestId)return;$('issue').textContent='Unable to load live NOAA data';lastFeatures=[];defaultView();renderLabels();showMessage('Official SPC map data could not be loaded. Check your connection or try Refresh. No forecast shapes are displayed rather than showing made-up risks. '+err.message)}}
$('refresh').onclick=load;nav();load();setInterval(()=>{if(document.visibilityState==='visible')load()},10*60*1000);
