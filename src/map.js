import {artIcon} from './icons.js';
export function createMap(el,locations,state,onSelect){
 if(!globalThis.L){el.innerHTML='<p class="notice">地圖程式未載入，請使用下方景點卡繼續探索。</p>';return {remove(){},fit(){},travel(id,arrive){arrive();}};}
 const L=globalThis.L,map=L.map(el,{scrollWheelZoom:false,zoomControl:false}).setView([24.189,120.684],15);
 L.control.zoom({zoomInTitle:'放大地圖',zoomOutTitle:'縮小地圖'}).addTo(map);
 const tile=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap 貢獻者</a>',crossOrigin:true}).addTo(map);
 let failed=false;tile.on('tileerror',()=>{if(!failed){failed=true;const p=document.getElementById('map-status');if(p)p.textContent='街道圖暫時無法載入。仍可點景點卡玩尋寶，連線後再試。';}});
 const markers=[];
 for(const l of locations){const marker=L.marker([l.lat,l.lng],{icon:L.divIcon({className:'map-anchor',html:'',iconSize:[0,0],iconAnchor:[0,0]}),keyboard:false}).addTo(map);markers.push({l,marker});}
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
 const bounds=L.latLngBounds(locations.map(l=>[l.lat,l.lng]));
 function layout(){const used=[],size=map.getSize();for(const {l,marker} of markers){const p=map.latLngToContainerPoint([l.lat,l.lng]);const done=state.stations[l.id]?.complete;let offset={x:-62,y:-100};const candidates=[];for(let ring=0;ring<7;ring++){for(let gx=-ring;gx<=ring;gx++){for(let gy=-ring;gy<=ring;gy++){if(Math.max(Math.abs(gx),Math.abs(gy))===ring)candidates.push([-62+gx*140,-100+gy*112]);}}}for(const [cx,cy]of candidates){const x=Math.max(8,Math.min(size.x-140,p.x+cx)),y=Math.max(8,Math.min(size.y-110,p.y+cy)),box={x,y,w:128,h:98};if(!used.some(b=>box.x<b.x+b.w+8&&box.x+box.w+8>b.x&&box.y<b.y+b.h+8&&box.y+box.h+8>b.y)){offset={x:x-p.x,y:y-p.y};used.push(box);break;}}
 const img=l.photos?.find(p=>p.kind==='photo');const label=done&&img?`<span class="polaroid"><img src="${img.src}" alt="${img.kind==='photo'?'景點照片':'教育插畫'}"><b>${l.short}</b><em>打卡紀念</em></span>`:`<span class="place-emoji">${artIcon(l.id)}</span><b>${l.short}</b>`;
 marker.setIcon(L.divIcon({className:'map-anchor',iconSize:[0,0],iconAnchor:[0,0],html:`<svg class="leader" aria-hidden="true"><line x1="0" y1="0" x2="${offset.x+62}" y2="${offset.y+42}"/><circle r="5"/></svg><button class="place-pin ${done&&img?'done':''} ${l.id==='school'?'school-pin':''}" style="left:${offset.x}px;top:${offset.y}px" aria-label="${l.short}${done?'，已打卡':''}">${label}</button>`}));
 marker.getElement().querySelector('button').onclick=()=>onSelect(l.id);
 }}
 map.on('zoomend moveend resize',layout);map.fitBounds(bounds,{padding:[120,100],maxZoom:16});layout();
 return {remove:()=>{cancelAnimationFrame(frame);map.remove();},fit:()=>map.fitBounds(bounds,{padding:[120,100]}),travel};
}
export function routeURL(from,to){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from.name+' '+from.address)+'&destination='+encodeURIComponent(to.name+' '+to.address)+'&travelmode=walking';}
export const streetURL=l=>'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+l.lat+','+l.lng;
export const placeURL=l=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(l.name+' '+l.address);
