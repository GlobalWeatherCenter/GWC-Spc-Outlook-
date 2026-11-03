/* Global Weather Center V14 — weather modules layered onto V12's working camera.
   NOAA/NWS public data. No proprietary API keys, no invented forecast features. */
(() => {
'use strict';
const el=id=>document.getElementById(id);
const WX={mode:'outlooks',req:0,layer:null,radarLayer:null,radarTimer:null,radarFrame:0,radarFrames:[],radarHost:'',playing:false,radarBusy:false,radarActive:false,radarSeq:0,modeData:[],satType:'GEOCOLOR',refresh:null};
const NWS='https://api.weather.gov';
const NOW='https://mapservices.weather.noaa.gov';
const RADAR_META='https://api.rainviewer.com/public/weather-maps.json';
const NOAA_RADAR_WMS='https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows';
map.createPane('gwcRadarPane');map.getPane('gwcRadarPane').style.zIndex='390';map.getPane('gwcRadarPane').style.pointerEvents='none';
map.createPane('gwcAlertPane');map.getPane('gwcAlertPane').style.zIndex='535';
const MD=NOW+'/vector/rest/services/outlooks/spc_mesoscale_discussion/MapServer/0/query';
const REPORTS=NOW+'/vector/rest/services/obs/nws_local_storm_reports/MapServer/0/query';
const sources={outlooks:'https://www.spc.noaa.gov/products/outlook/',radar:'https://radar.weather.gov/',warnings:'https://www.weather.gov/',watches:'https://www.spc.noaa.gov/products/watch/',discussions:'https://www.spc.noaa.gov/products/md/',reports:'https://www.spc.noaa.gov/climo/reports/',satellite:'https://www.goes.noaa.gov/conus.php?sat=G19'};
const modes=[['outlooks','OUTLOOKS'],['radar','RADAR'],['warnings','WARNINGS'],['watches','WATCHES'],['discussions','DISCUSSIONS'],['reports','STORM REPORTS'],['satellite','SATELLITE']];
const heads={outlooks:'SPC OUTLOOKS',radar:'LIVE WEATHER RADAR',warnings:'ACTIVE SEVERE WARNINGS',watches:'SEVERE WEATHER WATCHES',discussions:'SPC MESOSCALE DISCUSSIONS',reports:'RECENT STORM REPORTS',satellite:'GOES-19 SATELLITE'};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function status(msg,error=false){el('wxStatus').textContent=msg;el('wxStatus').classList.toggle('wx-error',error);}
function panel(html){const details=el('wxDetails');details.innerHTML=html;details.classList.add('open');details.scrollTop=0;}
function closePanel(){el('wxDetails').classList.remove('open');}
function openCard(title,sub,desc,href){const link=href&&/^https:\/\//i.test(href)?`<a class="wx-card-link" href="${safe(href)}" target="_blank" rel="noopener">Open official source ↗</a>`:'';panel(`<button class="wx-panel-close" aria-label="Close information">×</button><div class="wx-kicker">GLOBAL WEATHER CENTER</div><h2>${safe(title)}</h2><p class="wx-meta">${safe(sub||'')}</p><p>${safe(desc||'').replace(/\n/g,'<br>')}</p>${link}`);el('wxDetails').querySelector('.wx-panel-close').onclick=closePanel;}
function removeLayer(){if(WX.layer){map.removeLayer(WX.layer);WX.layer=null;}}
let eventActions=[];
function eventList(title, items){
 eventActions=items;
 const rows=items.slice(0,100).map((item,i)=>`<button class="wx-event-row" data-event-index="${i}"><b>${safe(item.title)}</b><small>${safe(item.sub||'Tap for full details')}</small></button>`).join('');
 panel(`<button class="wx-panel-close" aria-label="Close information">×</button><div class="wx-kicker">SELECT AN AREA OR AN EVENT</div><h2>${safe(title)}</h2><div class="wx-events">${rows||'<p>No active items in this feed.</p>'}</div>`);
 const box=el('wxDetails');box.querySelector('.wx-panel-close').onclick=closePanel;box.querySelectorAll('[data-event-index]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.eventIndex);if(eventActions[i])eventActions[i].open()});
}
function stopRadar(){WX.radarSeq++;WX.playing=false;WX.radarActive=false;clearTimeout(WX.radarTimer);WX.radarTimer=null;WX.radarBusy=false;if(WX.radarLayer){map.removeLayer(WX.radarLayer);WX.radarLayer=null;}WX.radarFrames=[];}
function clearMode(){WX.req++;stopRadar();removeLayer();el('wxSatellite').hidden=true;el('wxToolbar').replaceChildren();closePanel();}
function btn(label,onclick,cls=''){const b=document.createElement('button');b.type='button';b.className='wx-tool '+cls;b.textContent=label;b.onclick=onclick;el('wxToolbar').append(b);return b;}
function setMode(mode){
 if(!heads[mode])return;
 clearMode(); WX.modeData=[]; WX.mode=mode;document.body.dataset.mode=mode;
 el('wxRadarCredit').hidden=mode!=='radar';
 for(const b of el('wxModes').querySelectorAll('button')){const on=b.dataset.mode===mode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));}
 el('wxModeTitle').textContent=heads[mode];el('wxSource').href=sources[mode];
 el('wxModule').hidden=mode==='outlooks';if(weatherLayer){if(mode==='outlooks'&&!map.hasLayer(weatherLayer))weatherLayer.addTo(map);else if(mode!=='outlooks'&&map.hasLayer(weatherLayer))map.removeLayer(weatherLayer);}
 el('wxSource').hidden=mode==='outlooks';
 // Repaint labels on every mode change; labels stay above radar and vector outlines.
 map.getPane('gwcLabelPane').style.zIndex='690';
 requestAnimationFrame(()=>{map.invalidateSize({pan:false,animate:false});renderLabels();});
 setTimeout(()=>{map.invalidateSize({pan:false,animate:false});renderLabels();},160);
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
function openAlert(f){const p=f.properties||{};openCard(p.event||'NWS alert',(p.areaDesc||'')+' • Expires '+(p.ends||p.expires||'not specified'),[p.headline||'',p.description||'',p.instruction?'INSTRUCTIONS: '+p.instruction:''].filter(Boolean).join('\n\n'),p['@id']||p.id||sources[WX.mode]);}
function setupAlerts(watches){
 el('wxToolbar').replaceChildren();
 const req=++WX.req;const events=watches?['Tornado Watch','Severe Thunderstorm Watch']:['Tornado Warning','Severe Thunderstorm Warning','Flash Flood Warning'];
 btn(watches?'☷ VIEW WATCHES':'☷ VIEW ALERTS',()=>eventList(watches?'Active watches':'Active severe warnings',WX.modeData.map(f=>({title:f.properties?.event||'Weather alert',sub:f.properties?.areaDesc||'Area not stated',open:()=>openAlert(f)}))),'wx-accent-alerts');
 btn('↻ UPDATE',()=>setupAlerts(watches));
 status('Loading active NWS '+(watches?'watches':'warnings')+'…');removeLayer();
 Promise.allSettled(events.map(async event=>{const u=NWS+'/alerts/active?event='+encodeURIComponent(event);return await geo(u)})).then(res=>{
  if(req!==WX.req)return;const feats=[];let failed=0;
  res.forEach((r,i)=>{if(r.status==='fulfilled'){r.value.forEach(f=>{f.properties={...f.properties,event:f.properties?.event||events[i]};feats.push(f);});}else failed++;});
  const drawn=feats.filter(usGeom);
  if(drawn.length){const layer=L.geoJSON({type:'FeatureCollection',features:drawn},{pane:'gwcAlertPane',style:f=>({color:alertColor(f.properties?.event),weight:3.8,fillColor:alertColor(f.properties?.event),fillOpacity:.25,opacity:1}),onEachFeature:(f,l)=>{l.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openAlert(f)});l.bindTooltip(f.properties?.event||'Weather alert',{sticky:true,direction:'top'});}});setLayerStyle(layer);}
  WX.modeData=feats;
  status(`${feats.length} active ${watches?'watches':'warnings'} • ${drawn.length} mapped polygons${failed?' • '+failed+' feeds unavailable':''}. Tap a polygon or VIEW ${watches?'WATCHES':'ALERTS'}.`,failed===events.length);
  if(feats.length===0 && !failed)openCard('No active '+(watches?'watches':'severe warnings'),'Latest NWS feed','No matching active alert products were returned.',sources[WX.mode]);
  else if(!drawn.length && feats.length)eventList('Active alerts (no drawable polygons)',feats.map(f=>({title:f.properties?.event||'Weather alert',sub:f.properties?.areaDesc||'',open:()=>openAlert(f)})));
 }).catch(e=>{if(req===WX.req)status('NWS alert service unavailable: '+e.message,true)});
}
function openDiscussion(f){const p=f.properties||{};const number=String(p.name||'').match(/\d{3,4}/)?.[0];const official=number?`https://www.spc.noaa.gov/products/md/md${number.padStart(4,'0')}.html`:sources.discussions;openCard('Mesoscale Discussion '+(p.name||''),'NOAA Storm Prediction Center • '+(p.idp_filedate?new Date(p.idp_filedate).toLocaleString():'Active map area'),'Official SPC discussion area. Open the linked discussion for the full meteorological reasoning, location, hazards and watch probabilities.',official);}
function setupMD(){
 el('wxToolbar').replaceChildren();
 const req=++WX.req;btn('☷ VIEW DISCUSSIONS',()=>eventList('SPC mesoscale discussions',WX.modeData.map(f=>({title:'Discussion '+(f.properties?.name||''),sub:'SPC discussion area',open:()=>openDiscussion(f)}))),'wx-accent-discussions');btn('↻ UPDATE',setupMD);status('Loading SPC discussions…');removeLayer();
 geo(arc(MD)).then(features=>{
  if(req!==WX.req)return;
  const valid=features.filter(usGeom);
  if(valid.length){const layer=L.geoJSON({type:'FeatureCollection',features:valid},{pane:'gwcAlertPane',style:{color:'#d79aff',weight:3.5,fillColor:'#b55eff',fillOpacity:.24},onEachFeature:(f,l)=>{l.on('click',e=>{if(e.originalEvent)L.DomEvent.stopPropagation(e.originalEvent);openDiscussion(f)});l.bindTooltip('SPC Discussion '+(f.properties?.name||''),{sticky:true});}});setLayerStyle(layer);}
  WX.modeData=valid;
  status(`${valid.length} discussion areas • NOAA SPC • Tap a polygon or VIEW DISCUSSIONS`);
  if(!valid.length)openCard('No active discussion areas','SPC official feed','There are no currently mapped mesoscale discussions. This does not imply there is no severe weather.',sources.discussions);
 }).catch(e=>{if(req===WX.req)status('SPC discussion feed unavailable: '+e.message,true)});
}
function reportType(p){const t=String(p.descript||p.description||p.event||'');if(/tornado|waterspout|landspout/i.test(t))return 'tornado';if(/hail/i.test(t))return 'hail';if(/wind|downburst/i.test(t))return 'wind';return null;}
const reportColors={tornado:'#ff405a',hail:'#7ce6ee',wind:'#ffa943'};
function setupReports(){
 el('wxToolbar').replaceChildren();
 const req=++WX.req;
 let filter='all';
 const addFilter=(name,value)=>btn(name,()=>{filter=value;paint()});
 addFilter('ALL','all');addFilter('TORNADO','tornado');addFilter('WIND','wind');addFilter('HAIL','hail');btn('↻ UPDATE',setupReports);
 status('Loading latest 24-hour NWS local storm reports…');removeLayer();let features=[];
 function paint(){removeLayer();const choice=features.filter(f=>reportType(f.properties||{})&&(filter==='all'||reportType(f.properties||{})===filter));
  const cluster=L.layerGroup();choice.forEach(f=>{if(f.geometry?.type!=='Point')return;const [lon,lat]=f.geometry.coordinates||[];if(!Number.isFinite(lon)||!Number.isFinite(lat))return;const p=f.properties||{},kind=reportType(p),color=reportColors[kind];const mark=L.circleMarker([lat,lon],{radius:7,weight:2,color:'#101923',fillColor:color,fillOpacity:1});mark.on('click',()=>openCard(p.descript||kind.toUpperCase()+' REPORT',p.location||p.loc||p.state||'NWS local storm report',[p.remark||p.remarks||p.comments||'',p.time||p.datetime||''].filter(Boolean).join('\n'),sources.reports));mark.addTo(cluster)});setLayerStyle(cluster);status(`${choice.length} preliminary ${filter==='all'?'tornado, wind and hail':filter} reports in the latest 24 hours`);}
 geo(arc(REPORTS)).then(f=>{if(req!==WX.req)return;features=f;paint()}).catch(e=>{if(req===WX.req)status('Storm report feed unavailable: '+e.message,true)});
}
// NOAA nowCOAST live MRMS radar: the default, with no dependence on RainViewer.
// RainViewer history is an optional animation; on failure, return to NOAA live.
let noaaRadarLoaded=false;
function radarCredit(){
 const n=el('wxRadarCredit');if(n)n.hidden=WX.mode!=='radar';
}
function loadNoaaRadar(){
 stopRadar();WX.radarActive=true;WX.radarProvider='noaa';noaaRadarLoaded=false;
 status('Loading LIVE NOAA MRMS radar…');
 const layer=L.tileLayer.wms(NOAA_RADAR_WMS,{
   layers:'conus_base_reflectivity_mosaic',format:'image/png',transparent:true,
   version:'1.1.1',pane:'gwcRadarPane',opacity:.88,tileSize:256,
   updateWhenIdle:true,updateWhenZooming:false,keepBuffer:0,
   attribution:'Radar: NOAA nowCOAST / NWS MRMS'
 });
 let errors=0;
 layer.on('tileload',()=>{if(WX.mode==='radar'&&WX.radarProvider==='noaa'&&!noaaRadarLoaded){noaaRadarLoaded=true;status('LIVE NOAA MRMS radar • latest available reflectivity • automatic refresh');}});
 layer.on('tileerror',()=>{if(WX.radarProvider==='noaa'&&++errors===3)status('NOAA radar tiles are not responding. Try the radar source link or Animated History.',true)});
 WX.radarLayer=layer;layer.addTo(map);radarCredit();
}
function loadRadarFrame(){
 if(WX.mode!=='radar'||WX.radarProvider!=='rainviewer'||!WX.radarActive||!WX.radarFrames.length)return;
 const frame=WX.radarFrames[WX.radarFrame];if(!frame)return;
 const seq=++WX.radarSeq;
 const url=WX.radarHost+frame.path+'/256/{z}/{x}/{y}/2/1_1.png';
 const layer=L.tileLayer(url,{pane:'gwcRadarPane',opacity:.9,maxZoom:11,maxNativeZoom:7,minZoom:3,tileSize:256,updateWhenIdle:true,updateWhenZooming:false,keepBuffer:0,attribution:'Radar © RainViewer'});
 const prior=WX.radarLayer;
 WX.radarLayer=layer;
 let good=false,errors=0;
 layer.on('tileload',()=>{if(seq!==WX.radarSeq||WX.mode!=='radar')return;good=true;if(prior&&map.hasLayer(prior))map.removeLayer(prior);status('Animated radar • '+new Date(frame.time*1000).toLocaleString('en-US',{timeZone:'UTC',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC • frame '+(WX.radarFrame+1)+'/'+WX.radarFrames.length);});
 layer.on('tileerror',()=>{if(seq===WX.radarSeq&&++errors>=3&&!good){WX.playing=false;clearTimeout(WX.radarTimer);status('RainViewer history tiles unavailable. Returning to live NOAA radar.',true);loadNoaaRadar()}});
 layer.addTo(map);
 setTimeout(()=>{if(seq===WX.radarSeq&&prior&&map.hasLayer(prior))map.removeLayer(prior);},2100);
}
function radarControls(){
 el('wxToolbar').replaceChildren();
 btn('● LIVE NOAA',loadNoaaRadar,'wx-accent-radar');
 btn('▶ ANIMATED HISTORY',loadHistory,'wx-accent-blue');
 btn('◀ PREV',()=>{if(WX.radarProvider==='rainviewer'&&WX.radarFrames.length){WX.playing=false;clearTimeout(WX.radarTimer);WX.radarFrame=(WX.radarFrame+WX.radarFrames.length-1)%WX.radarFrames.length;loadRadarFrame()}});
 btn('NEXT ▶',()=>{if(WX.radarProvider==='rainviewer'&&WX.radarFrames.length){WX.playing=false;clearTimeout(WX.radarTimer);WX.radarFrame=(WX.radarFrame+1)%WX.radarFrames.length;loadRadarFrame()}});
 btn('↻ RELOAD',()=>{if(WX.radarProvider==='rainviewer')loadHistory();else loadNoaaRadar()});
}
function setupRadar(){
 radarControls();loadNoaaRadar();
}
async function loadHistory(){
 if(WX.mode!=='radar')return;
 WX.playing=false;clearTimeout(WX.radarTimer);WX.radarProvider='rainviewer';WX.radarActive=true;
 status('Loading RainViewer historical radar frames…');
 const req=WX.req;
 try{
  const res=await fetch(RADAR_META,{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
  const data=await res.json();if(req!==WX.req||WX.mode!=='radar'||WX.radarProvider!=='rainviewer')return;
  if(!/^https:\/\//.test(data.host||'')||!Array.isArray(data.radar?.past)||!data.radar.past.length)throw Error('No historical radar frames available');
  WX.radarHost=data.host;WX.radarFrames=data.radar.past.slice(-6);WX.radarFrame=WX.radarFrames.length-1;
  WX.playing=true;loadRadarFrame();WX.radarTimer=setTimeout(tickRadar,2300);
 }catch(e){if(req===WX.req&&WX.mode==='radar'){status('Radar history unavailable ('+e.message+'). Using NOAA live radar.',true);loadNoaaRadar();}}
}
function tickRadar(){clearTimeout(WX.radarTimer);if(!WX.playing||WX.mode!=='radar'||WX.radarProvider!=='rainviewer'||!WX.radarFrames.length)return;WX.radarFrame=(WX.radarFrame+1)%WX.radarFrames.length;loadRadarFrame();WX.radarTimer=setTimeout(tickRadar,2300);}
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
el('wxAlertsQuick').onclick=()=>setMode('warnings');
el('wxStream').onclick=()=>setBroadcast(!document.body.classList.contains('gwc-broadcast'));
el('wxExitStream').onclick=()=>setBroadcast(false);
function setBroadcast(on){document.body.classList.toggle('gwc-broadcast',on);el('wxExitStream').hidden=!on;if(on){if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});}else if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});setTimeout(()=>map.invalidateSize({pan:false}),100);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('gwc-broadcast'))setBroadcast(false);if(e.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))setBroadcast(!document.body.classList.contains('gwc-broadcast'))});
for(const [mode,label] of modes){const b=document.createElement('button');b.textContent=label;b.type='button';b.dataset.mode=mode;b.onclick=()=>setMode(mode);el('wxModes').append(b)}
// The existing V13 select-day / category buttons still run their original app.js handlers.
// Mode changes never reinitialize Leaflet or the custom pinch engine.
setMode('outlooks');
setInterval(()=>{if(document.visibilityState==='visible'&&WX.mode!=='outlooks'&&WX.mode!=='satellite'){const m=WX.mode;if(m==='radar'&&WX.radarActive){if(WX.radarProvider==='noaa')loadNoaaRadar();else loadRadarFrame();}else if(m==='warnings')setupAlerts(false);else if(m==='watches')setupAlerts(true);else if(m==='discussions')setupMD();else if(m==='reports')setupReports();}},5*60*1000);
})();
