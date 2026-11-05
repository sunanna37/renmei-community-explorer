import {artIcon} from './icons.js';
export function createMap(el,locations,state,onSelect){
 if(!globalThis.L){el.innerHTML='<p class="notice">地圖程式未載入，請使用下方景點卡繼續探索。</p>';return {remove(){},fit(){},school(){}};}
 const L=globalThis.L,map=L.map(el,{scrollWheelZoom:false,zoomControl:false}).setView([24.189,120.684],15);
 L.control.zoom({zoomInTitle:'放大地圖',zoomOutTitle:'縮小地圖'}).addTo(map);
 const tile=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap 貢獻者</a>',crossOrigin:true}).addTo(map);
 let failed=false;tile.on('tileerror',()=>{if(!failed){failed=true;const p=document.getElementById('map-status');if(p)p.textContent='街道圖暫時無法載入。仍可點景點卡玩尋寶，連線後再試。';}});
 const markers=[];
 for(const l of locations){const marker=L.marker([l.lat,l.lng],{icon:L.divIcon({className:'map-anchor',html:'',iconSize:[0,0],iconAnchor:[0,0]}),keyboard:false}).addTo(map);markers.push({l,marker});}
 const bounds=L.latLngBounds(locations.map(l=>[l.lat,l.lng]));
 function layout(){const used=[],size=map.getSize();for(const {l,marker} of markers){const p=map.latLngToContainerPoint([l.lat,l.lng]);const done=state.stations[l.id]?.complete;let offset={x:-62,y:-100};const candidates=[];for(let ring=0;ring<7;ring++){for(let gx=-ring;gx<=ring;gx++){for(let gy=-ring;gy<=ring;gy++){if(Math.max(Math.abs(gx),Math.abs(gy))===ring)candidates.push([-62+gx*140,-100+gy*112]);}}}for(const [cx,cy]of candidates){const x=Math.max(8,Math.min(size.x-140,p.x+cx)),y=Math.max(8,Math.min(size.y-110,p.y+cy)),box={x,y,w:128,h:98};if(!used.some(b=>box.x<b.x+b.w+8&&box.x+box.w+8>b.x&&box.y<b.y+b.h+8&&box.y+box.h+8>b.y)){offset={x:x-p.x,y:y-p.y};used.push(box);break;}}
 const img=l.photos?.find(p=>p.kind==='photo');const label=done&&img?`<span class="polaroid"><img src="${img.src}" alt="${img.kind==='photo'?'景點照片':'教育插畫'}"><b>${l.short}</b><em>打卡紀念</em></span>`:`<span class="place-emoji">${artIcon(l.id)}</span><b>${l.short}</b>`;
 marker.setIcon(L.divIcon({className:'map-anchor',iconSize:[0,0],iconAnchor:[0,0],html:`<svg class="leader" aria-hidden="true"><line x1="0" y1="0" x2="${offset.x+62}" y2="${offset.y+42}"/><circle r="5"/></svg><button class="place-pin ${done&&img?'done':''} ${l.id==='school'?'school-pin':''}" style="left:${offset.x}px;top:${offset.y}px" aria-label="${l.short}${done?'，已打卡':''}">${label}</button>`}));
 marker.getElement().querySelector('button').onclick=()=>onSelect(l.id);
 }}
 map.on('zoomend moveend resize',layout);map.fitBounds(bounds,{padding:[120,100],maxZoom:16});layout();
 return {remove:()=>map.remove(),fit:()=>map.fitBounds(bounds,{padding:[120,100]}),school:()=>map.setView([locations[0].lat,locations[0].lng],17)};
}
export function routeURL(from,to){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from.name+' '+from.address)+'&destination='+encodeURIComponent(to.name+' '+to.address)+'&travelmode=walking';}
export const streetURL=l=>'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+l.lat+','+l.lng;
export const placeURL=l=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(l.name+' '+l.address);
