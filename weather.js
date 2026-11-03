/* Global Weather Center V14 — weather modules layered onto V12's working camera.
   NOAA/NWS public data. No proprietary API keys, no invented forecast features. */
(() => {
'use strict';
const el=id=>document.getElementById(id);
const WX={mode:'outlooks',req:0,layer:null,radarLayer:null,radarTimer:null,radarFrame:7,playing:false,radarBusy:false,radarActive:false,radarSeq:0,modeData:[],satType:'GEOCOLOR',refresh:null};
const NWS='https://api.weather.gov';
const NOW='https://mapservices.weather.noaa.gov';
const RADAR=NOW+'/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer/exportImage';
map.createPane('gwcRadarPane');map.getPane('gwcRadarPane').style.zIndex='380';map.getPane('gwcRadarPane').style.pointerEvents='none';
const MD=NOW+'/vector/rest/services/outlooks/spc_mesoscale_discussion/MapServer/0/query';
const REPORTS=NOW+'/vector/rest/services/obs/nws_local_storm_reports/MapServer/0/query';
const sources={outlooks:'https://www.spc.noaa.gov/products/outlook/',radar:'https://radar.weather.gov/',warnings:'https://www.weather.gov/',watches:'https://www.spc.noaa.gov/products/watch/',discussions:'https://www.spc.noaa.gov/products/md/',reports:'https://www.spc.noaa.gov/climo/reports/',satellite:'https://www.goes.noaa.gov/conus.php?sat=G19'};
const modes=[['outlooks','OUTLOOKS'],['radar','RADAR'],['warnings','WARNINGS'],['watches','WATCHES'],['discussions','DISCUSSIONS'],['reports','STORM REPORTS'],['satellite','SATELLITE']];
const heads={outlooks:'SPC OUTLOOKS',radar:'LIVE WEATHER RADAR',warnings:'ACTIVE SEVERE WARNINGS',watches:'SEVERE WEATHER WATCHES',discussions:'SPC MESOSCALE DISCUSSIONS',reports:'RECENT STORM REPORTS',satellite:'GOES-19 SATELLITE'};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function status(msg,error=false){el('wxStatus').textContent=msg;el('wxStatus').classList.toggle('wx-error',error);}
function panel(html){el('wxDetails').innerHTML=html;el('wxDetails').classList.add('open');}
function closePanel(){el('wxDetails').classList.remove('open');}
function openCard(title,sub,desc,href){const link=href&&/^https:\/\//i.test(href)?`<a class="wx-card-link" href="${safe(href)}" target="_blank" rel="noopener">Open official source ↗</a>`:'';panel(`<button class="wx-panel-close" aria-label="Close information">×</button><div class="wx-kicker">GLOBAL WEATHER CENTER</div><h2>${safe(title)}</h2><p class="wx-meta">${safe(sub||'')}</p><p>${safe(desc||'').replace(/\n/g,'<br>')}</p>${link}`);el('wxDetails').querySelector('.wx-panel-close').onclick=closePanel;}
function removeLayer(){if(WX.layer){map.removeLayer(WX.layer);WX.layer=null;}}
function stopRadar(){WX.radarSeq++;WX.playing=false;WX.radarActive=false;clearTimeout(WX.radarTimer);WX.radarTimer=null;WX.radarBusy=false;if(WX.radarLayer){map.removeLayer(WX.radarLayer);WX.radarLayer=null;}}
function clearMode(){WX.req++;stopRadar();removeLayer();el('wxSatellite').hidden=true;el('wxToolbar').replaceChildren();closePanel();}
function btn(label,onclick,cls=''){const b=document.createElement('button');b.type='button';b.className='wx-tool '+cls;b.textContent=label;b.onclick=onclick;el('wxToolbar').append(b);return b;}
function setMode(mode){
 if(!heads[mode])return;
 clearMode(); WX.mode=mode;document.body.dataset.mode=mode;
 for(const b of el('wxModes').querySelectorAll('button')){const on=b.dataset.mode===mode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));}
 el('wxModeTitle').textContent=heads[mode];el('wxSource').href=sources[mode];
 el('wxModule').hidden=mode==='outlooks';if(weatherLayer){if(mode==='outlooks'&&!map.hasLayer(weatherLayer))weatherLayer.addTo(map);else if(mode!=='outlooks'&&map.hasLayer(weatherLayer))map.removeLayer(weatherLayer);}
 el('wxSource').hidden=mode==='outlooks';
 if(mode==='outlooks'){status('Live SPC outlooks • select Day and hazard');return;}
 if(mode==='radar')setupRadar();
 else if(mode==='warnings')setupAlerts(false);
 else if(mode==='watches')setupAlerts(true);
 else if(mode==='discussions')setupMD();
 else if(mode==='reports')setupReports();
 else if(mode==='satellite')setupSatellite();
}
function setLayerStyle(layer){layer.addTo(map);WX.layer=layer;}
async function geo(url){const r=await fetch(url,{headers:{Accept:'application/geo+json, application/json;q=0.9'},cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(j.error)throw Error(j.error.message||'Source error');if(!Array.isArray(j.features))throw Error('No GeoJSON features');return j.features;}
function arc(url){return url+'?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson&_='+Math.floor(Date.now()/60000);}
function usGeom(f){return f?.geometry&&['Polygon','MultiPolygon','Point','MultiPoint'].includes(f.geometry.type)}
function alertColor(event){if(/tornado/i.test(event))return '#ff334b';if(/severe thunderstorm/i.test(event))return '#ffd638';if(/flash flood/i.test(event))return '#45ec9d';return '#8dbbff';}
function alertPopup(p){return `<strong>${safe(p.event)}</strong><br>${safe(p.areaDesc||'')}<br><small>Until ${safe(p.ends||p.expires||'Not provided')}</small>`;}
function setupAlerts(watches){
 const req=++WX.req;const events=watches?['Tornado Watch','Severe Thunderstorm Watch']:['Tornado Warning','Severe Thunderstorm Warning','Flash Flood Warning'];
 btn('↻ UPDATE',()=>setupAlerts(watches));
 status('Loading active NWS '+(watches?'watches':'warnings')+'…');removeLayer();
 Promise.allSettled(events.map(async event=>{const u=NWS+'/alerts/active?event='+encodeURIComponent(event);return await geo(u)})).then(res=>{
  if(req!==WX.req)return;const feats=[];let failed=0;
  res.forEach((r,i)=>{if(r.status==='fulfilled'){r.value.forEach(f=>{f.properties={...f.properties,event:f.properties?.event||events[i]};feats.push(f);});}else failed++;});
  const drawn=feats.filter(usGeom);
  if(drawn.length){const layer=L.geoJSON({type:'FeatureCollection',features:drawn},{style:f=>({color:alertColor(f.properties?.event),weight:2.7,fillColor:alertColor(f.properties?.event),fillOpacity:.16,opacity:1}),onEachFeature:(f,l)=>{const p=f.properties||{};l.on('click',()=>openCard(p.event||'NWS alert',p.areaDesc||'',p.description||p.headline||'',p['@id']||f.id||'https://www.weather.gov/'));}});setLayerStyle(layer);}
  WX.modeData=feats;
  status(`${feats.length} active ${watches?'watches':'warnings'} • ${drawn.length} mapped polygons${failed?' • '+failed+' feeds unavailable':''}`,failed===events.length);
  if(feats.length===0 && !failed)openCard('No active '+(watches?'watches':'severe warnings'),'Latest NWS feed','No matching active alert products were returned.',sources[WX.mode]);
  else if(!drawn.length && feats.length)openCard('Active alerts available',feats.length+' alerts','The NWS feed returned alerts without drawable geometries. Use the official source link for county-level coverage.',sources[WX.mode]);
 }).catch(e=>{if(req===WX.req)status('NWS alert service unavailable: '+e.message,true)});
}
function setupMD(){
 const req=++WX.req;btn('↻ UPDATE',setupMD);status('Loading SPC discussions…');removeLayer();
 geo(arc(MD)).then(features=>{
  if(req!==WX.req)return;
  const valid=features.filter(usGeom);
  if(valid.length){const layer=L.geoJSON({type:'FeatureCollection',features:valid},{style:{color:'#c977ff',weight:2.6,fillColor:'#b55eff',fillOpacity:.19},onEachFeature:(f,l)=>{l.on('click',()=>{const p=f.properties||{};openCard('Mesoscale Discussion '+(p.name||''),'SPC discussion area','Select the official discussion for watch potential and short-term severe-weather reasoning.',sources.discussions);});}});setLayerStyle(layer);}
  status(`${valid.length} discussion areas • NOAA SPC`);
  if(!valid.length)openCard('No active discussion areas','SPC official feed','There are no currently mapped mesoscale discussions. This does not imply there is no severe weather.',sources.discussions);
 }).catch(e=>{if(req===WX.req)status('SPC discussion feed unavailable: '+e.message,true)});
}
function reportType(p){const t=String(p.descript||p.description||p.event||'');if(/tornado|waterspout|landspout/i.test(t))return 'tornado';if(/hail/i.test(t))return 'hail';if(/wind|downburst/i.test(t))return 'wind';return null;}
const reportColors={tornado:'#ff405a',hail:'#7ce6ee',wind:'#ffa943'};
function setupReports(){
 const req=++WX.req;
 let filter='all';
 const addFilter=(name,value)=>btn(name,()=>{filter=value;paint()});
 addFilter('ALL','all');addFilter('TORNADO','tornado');addFilter('WIND','wind');addFilter('HAIL','hail');btn('↻ UPDATE',setupReports);
 status('Loading latest 24-hour NWS local storm reports…');removeLayer();let features=[];
 function paint(){removeLayer();const choice=features.filter(f=>reportType(f.properties||{})&&(filter==='all'||reportType(f.properties||{})===filter));
  const cluster=L.layerGroup();choice.forEach(f=>{if(f.geometry?.type!=='Point')return;const [lon,lat]=f.geometry.coordinates||[];if(!Number.isFinite(lon)||!Number.isFinite(lat))return;const p=f.properties||{},kind=reportType(p),color=reportColors[kind];const mark=L.circleMarker([lat,lon],{radius:7,weight:2,color:'#101923',fillColor:color,fillOpacity:1});mark.on('click',()=>openCard(p.descript||kind.toUpperCase()+' REPORT',p.location||p.loc||p.state||'NWS local storm report',[p.remark||p.remarks||p.comments||'',p.time||p.datetime||''].filter(Boolean).join('\n'),sources.reports));mark.addTo(cluster)});setLayerStyle(cluster);status(`${choice.length} preliminary ${filter==='all'?'tornado, wind and hail':filter} reports in the latest 24 hours`);}
 geo(arc(REPORTS)).then(f=>{if(req!==WX.req)return;features=f;paint()}).catch(e=>{if(req===WX.req)status('Storm report feed unavailable: '+e.message,true)});
}
function radarFrameTime(index){const interval=10*60*1000;const now=Date.now();const latest=Math.floor((now-15*60*1000)/interval)*interval;return latest-(7-index)*interval;}
function projectedBbox(bounds){const a=map.options.crs.project(bounds.getSouthWest()),b=map.options.crs.project(bounds.getNorthEast());return [a.x,a.y,b.x,b.y].map(n=>Math.round(n)).join(',');}
function loadRadarFrame(){
 if(WX.mode!=='radar'||!WX.radarActive||pinchState)return;
 const bounds=map.getBounds();if(!bounds.isValid())return;
 const dim=map.getSize();const w=Math.min(1800,Math.max(640,Math.round(dim.x))),h=Math.min(1400,Math.max(400,Math.round(dim.y)));
 const at=radarFrameTime(WX.radarFrame);const params=new URLSearchParams({bbox:projectedBbox(bounds),bboxSR:'3857',imageSR:'3857',size:w+','+h,format:'png32',transparent:'true',f:'image',time:at+','+at,_:Math.floor(Date.now()/300000).toString()});
 const overlay=L.imageOverlay(RADAR+'?'+params,bounds,{opacity:.83,interactive:false,pane:'gwcRadarPane'});
 const previous=WX.radarLayer;const currentReq=WX.req;const frameSerial=++WX.radarSeq;
 overlay.on('load',()=>{if(currentReq!==WX.req||WX.mode!=='radar'||frameSerial!==WX.radarSeq){map.removeLayer(overlay);return;}if(previous&&map.hasLayer(previous))map.removeLayer(previous);status('MRMS radar • frame '+(WX.radarFrame+1)+'/8 • requested '+new Date(at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'})+' UTC');});
 overlay.on('error',()=>{if(currentReq!==WX.req||frameSerial!==WX.radarSeq)return;status('Radar image unavailable for this frame. Source: NOAA MRMS.',true);if(map.hasLayer(overlay))map.removeLayer(overlay);if(previous)WX.radarLayer=previous;});
 WX.radarLayer=overlay;overlay.addTo(map);
}
function setupRadar(){
 WX.radarActive=true;WX.radarFrame=7;WX.playing=false;const play=btn('▶ PLAY',()=>{WX.playing=!WX.playing;play.textContent=WX.playing?'Ⅱ PAUSE':'▶ PLAY';if(WX.playing)tickRadar();else clearTimeout(WX.radarTimer);});
 btn('◀ PREV',()=>{WX.playing=false;clearTimeout(WX.radarTimer);play.textContent='▶ PLAY';WX.radarFrame=(WX.radarFrame+7)%8;loadRadarFrame()});
 btn('NEXT ▶',()=>{WX.playing=false;clearTimeout(WX.radarTimer);play.textContent='▶ PLAY';WX.radarFrame=(WX.radarFrame+1)%8;loadRadarFrame()});
 btn('↻ LATEST',()=>{WX.radarFrame=7;loadRadarFrame()});
 status('Loading NOAA MRMS reflectivity • latest four-hour service');loadRadarFrame();
}
function tickRadar(){clearTimeout(WX.radarTimer);if(!WX.playing||WX.mode!=='radar')return;WX.radarFrame=(WX.radarFrame+1)%8;loadRadarFrame();WX.radarTimer=setTimeout(tickRadar,1800);}
let radarMoveTimer;
map.on('moveend',()=>{if(WX.mode!=='radar'||!WX.radarActive||pinchState)return;clearTimeout(radarMoveTimer);radarMoveTimer=setTimeout(()=>{if(!pinchState)loadRadarFrame()},380)});
mapElement.addEventListener('touchend',()=>{if(WX.mode!=='radar')return;clearTimeout(radarMoveTimer);radarMoveTimer=setTimeout(()=>{if(!pinchState)loadRadarFrame()},450)},{passive:true});
function setupSatellite(){
 btn('GEOCOLOR',()=>setSatellite('GEOCOLOR'));
 btn('INFRARED',()=>setSatellite('13'));
 btn('↻ UPDATE',()=>setSatellite(WX.satType));
 setSatellite('GEOCOLOR');
}
function setSatellite(kind){WX.satType=kind;el('wxSatellite').hidden=false;const image=el('wxSatelliteImage');const type=kind==='13'?'Infrared Band 13':'GeoColor';image.onerror=()=>{status('GOES satellite image unavailable — use NOAA source link',true);};image.onload=()=>status('NOAA GOES-19 CONUS • '+type+' • refreshed imagery');image.src=`https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/${kind}/1250x750.jpg?cache=${Math.floor(Date.now()/300000)}`;el('wxSatelliteCaption').textContent=`GOES-19 • ${type} • CONUS • image from NOAA/NESDIS`;status('Loading GOES-19 '+type+'…');}
// City search uses the cities in the established basemap. Weather readings are nearest-station NWS observations.
function searchCities(q){const v=q.trim().toLowerCase();if(v.length<2)return [];return CITIES.filter(c=>c[0].toLowerCase().includes(v)).sort((a,b)=>b[3]-a[3]).slice(0,9);}
function showSearch(){const q=el('wxSearch').value,found=searchCities(q),target=el('wxSuggestions');target.replaceChildren();target.hidden=!found.length;
 found.forEach(c=>{const b=document.createElement('button');b.textContent=c[0];b.onclick=()=>{target.hidden=true;el('wxSearch').value=c[0];jumpCity(c)};target.append(b)});}
async function jumpCity(c){markUserGesture();map.setView([c[1],c[2]],Math.max(7,map.getZoom()),{animate:false});renderLabels();openCard(c[0],'National Weather Service • nearest station','Loading recent observed conditions…','https://forecast.weather.gov/');
 const title=c[0];try{const points=await fetch(`${NWS}/points/${c[1]},${c[2]}`,{headers:{Accept:'application/geo+json'}});if(!points.ok)throw Error('NWS location lookup failed');const p=await points.json();const stationsUrl=p.properties?.observationStations;if(!stationsUrl)throw Error('No nearby station data');const sr=await fetch(stationsUrl);if(!sr.ok)throw Error('Stations unavailable');const stations=await sr.json();const station=stations.features?.[0];const id=station?.properties?.stationIdentifier;if(!id)throw Error('No station identified');const obsR=await fetch(`${NWS}/stations/${encodeURIComponent(id)}/observations/latest`);if(!obsR.ok)throw Error('Latest observation not available');const o=(await obsR.json()).properties||{};const f=(x,u)=>Number.isFinite(x?.value)?Math.round(x.value*10)/10+' '+u:'Unavailable';const speed=Number.isFinite(o.windSpeed?.value)?Math.round(o.windSpeed.value*2.23694)+' mph':'Unavailable';let desc=`Station: ${station.properties?.name||id}\nObserved: ${o.timestamp?new Date(o.timestamp).toLocaleString():'Unavailable'}\nTemperature: ${f(o.temperature,'°C')}\nWind: ${speed} (${o.windDirection?.value??'?'}°)\nHumidity: ${f(o.relativeHumidity,'%')}\nPressure: ${f(o.barometricPressure,'Pa')}\nConditions: ${o.textDescription||'Not reported'}`;openCard(title,'Latest nearby official station observation',desc,`https://forecast.weather.gov/MapClick.php?lat=${c[1]}&lon=${c[2]}`);
 }catch(e){openCard(title,'NWS station reading unavailable',e.message+'. Map search and zoom still work.',`https://forecast.weather.gov/MapClick.php?lat=${c[1]}&lon=${c[2]}`);}}
el('wxSearch').addEventListener('input',showSearch);
el('wxSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const found=searchCities(el('wxSearch').value);if(found.length)jumpCity(found[0]);el('wxSuggestions').hidden=true}if(e.key==='Escape')el('wxSuggestions').hidden=true});
el('wxPanelDismiss').onclick=closePanel;
el('wxStream').onclick=()=>setBroadcast(!document.body.classList.contains('gwc-broadcast'));
el('wxExitStream').onclick=()=>setBroadcast(false);
function setBroadcast(on){document.body.classList.toggle('gwc-broadcast',on);el('wxExitStream').hidden=!on;if(on){if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});}else if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});setTimeout(()=>map.invalidateSize({pan:false}),100);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('gwc-broadcast'))setBroadcast(false);if(e.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))setBroadcast(!document.body.classList.contains('gwc-broadcast'))});
for(const [mode,label] of modes){const b=document.createElement('button');b.textContent=label;b.type='button';b.dataset.mode=mode;b.onclick=()=>setMode(mode);el('wxModes').append(b)}
// The existing V13 select-day / category buttons still run their original app.js handlers.
// Mode changes never reinitialize Leaflet or the custom pinch engine.
setMode('outlooks');
setInterval(()=>{if(document.visibilityState==='visible'&&WX.mode!=='outlooks'&&WX.mode!=='satellite'){const m=WX.mode;if(m==='radar'&&WX.radarActive)loadRadarFrame();else if(m==='warnings')setupAlerts(false);else if(m==='watches')setupAlerts(true);else if(m==='discussions')setupMD();else if(m==='reports')setupReports();}},5*60*1000);
})();
