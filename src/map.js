import {neighborhoodRoads} from './neighborhood-roads.js';
import {artIcon} from './icons.js';
export function createMap(el,locations,state,onSelect){
 if(!globalThis.L){el.innerHTML='<p class="notice">地圖程式未載入，請使用下方景點卡繼續探索。</p>';return {remove(){},fit(){},travel(id,arrive){arrive();}};}
 const L=globalThis.L,map=L.map(el,{scrollWheelZoom:false,zoomControl:false,zoomSnap:.25,zoomDelta:.5,maxZoom:19}).setView([24.189,120.684],15);
 L.control.zoom({zoomInTitle:'放大地圖',zoomOutTitle:'縮小地圖'}).addTo(map);
 map.attributionControl.addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap 貢獻者</a>');
 for(const [name,lines] of Object.entries(neighborhoodRoads)){
  L.polyline(lines,{color:'#d7dace',weight:12,interactive:false}).addTo(map);
  L.polyline(lines,{color:'#fffdf5',weight:8,interactive:false}).addTo(map);
  const points=lines.flat().filter(([lat,lng])=>lat>24.183&&lat<24.194&&lng>120.680&&lng<120.686);
  if(points.length&&(name.startsWith('崇德路')||name.startsWith('昌平路')||name==='后庄路')){
   L.marker(points[Math.floor(points.length/2)],{
    interactive:false,keyboard:false,zIndexOffset:-1500,
    icon:L.divIcon({className:'neighborhood-road-name',html:name,iconSize:[76,22],iconAnchor:[38,11]})
   }).addTo(map);
  }
 }
 // The post office and library share a small block. Split their buttons
 // by a few pixels, keeping the stems attached to their real coordinates.
 const placement={
  school:[36,-23,'above'], temple:[0,-19,'below'],
  post:[-25,12,'below'], library:[25,-24,'above'],
  health:[-16,-22,'below'], fire:[16,-22,'right'], police:[0,-19,'above']
 };
 for(const location of locations){
  const [x,y,labelSide]=placement[location.id];
  const done=Boolean(state.stations[location.id]?.complete);
  const length=Math.hypot(x,y);
  const angle=Math.atan2(y,x)*180/Math.PI;
  const marker=L.marker([location.lat,location.lng],{
   keyboard:false,
   icon:L.divIcon({
    className:'station-marker',
    iconSize:[0,0],
    iconAnchor:[0,0],
    html:`<span class="station-marker-stem" aria-hidden="true" style="width:${length}px;transform:rotate(${angle}deg)"></span><span class="station-marker-dot" aria-hidden="true"></span><button type="button" class="station-pin station-pin-${labelSide}" style="left:${x}px;top:${y}px" aria-label="${location.short}${done?'，已打卡':''}"><span class="station-pin-art">${artIcon(location.id)}${done?'<span class="station-pin-check" aria-hidden="true">✓</span>':''}</span><b>${location.short}</b></button>`
   })
  }).addTo(map);
  const pin=marker.getElement().querySelector('button');
  L.DomEvent.disableClickPropagation(pin);
  pin.addEventListener('click',()=>onSelect(location.id));
 }
 const start=locations.find(location=>location.id===state.mapLocation)??locations[0];
 const mascot=L.marker([start.lat,start.lng],{
  interactive:false,keyboard:false,zIndexOffset:2000,
  icon:L.divIcon({className:'map-mascot',html:'<img src="assets/characters/explorer-v2.png" alt="小芽">',iconSize:[54,62],iconAnchor:[27,58]})
 }).addTo(map);
 let frame;
 function travel(id,arrive){
  const destination=locations.find(location=>location.id===id);
  if(!destination)return;
  cancelAnimationFrame(frame);
  const from=mascot.getLatLng();
  const started=performance.now();
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1250;
  map.panInside([destination.lat,destination.lng],{padding:[60,75]});
  function move(now){
   const progress=duration?Math.min((now-started)/duration,1):1;
   const eased=progress*progress*(3-2*progress);
   mascot.setLatLng([from.lat+(destination.lat-from.lat)*eased,from.lng+(destination.lng-from.lng)*eased]);
   if(progress<1)frame=requestAnimationFrame(move);
   else arrive();
  }
  frame=requestAnimationFrame(move);
 }
 const bounds=L.latLngBounds(locations.map(location=>[location.lat,location.lng]));
 function fit(){
  const padding=L.point(map.getSize().x<480?66:75,56);
  map.setMinZoom(0);
  const zoom=Math.min(18,map.getBoundsZoom(bounds,false,padding.multiplyBy(2)));
  map.setMinZoom(Math.max(0,zoom-1.5));
  map.fitBounds(bounds,{padding,maxZoom:zoom});
 }
 fit();
 new L.Control.Scale({imperial:false,position:'bottomleft'}).addTo(map);
 return {remove:()=>{cancelAnimationFrame(frame);map.remove();},fit,travel};
}
export function routeURL(from,to){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from.name+' '+from.address)+'&destination='+encodeURIComponent(to.name+' '+to.address)+'&travelmode=walking';}
export const streetURL=l=>'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+l.lat+','+l.lng;
export const placeURL=l=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(l.name+' '+l.address);
