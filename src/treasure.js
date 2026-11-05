export function setupTreasure(container,data,found,onFind){
 const lens=container.querySelector('.lens'),img=container.querySelector('img');let moved=false,start=null;
 function move(e){const r=container.getBoundingClientRect();const x=Math.max(0,Math.min(r.width,e.clientX-r.left)),y=Math.max(0,Math.min(r.height,e.clientY-r.top));lens.style.display='block';lens.style.left=x+'px';lens.style.top=y+'px';lens.style.backgroundImage=`url("${data.image}")`;lens.style.backgroundSize=`${r.width*2}px ${r.height*2}px`;lens.style.backgroundPosition=`${64-x*2}px ${64-y*2}px`;if(start&&Math.hypot(x-start.x,y-start.y)>12)moved=true;}
 container.onpointermove=move;container.onpointerdown=e=>{const r=container.getBoundingClientRect();start={x:e.clientX-r.left,y:e.clientY-r.top};moved=false;move(e);if(e.target===img||e.target===container)container.setPointerCapture(e.pointerId);};container.onpointerleave=()=>{lens.style.display='none';};
 container.onpointerup=e=>{if(!moved&&e.target.tagName!=='BUTTON'){const r=container.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const t=data.targets.find(t=>Math.abs(x-t.x)<=t.rx&&Math.abs(y-t.y)<=t.ry);if(t)onFind(t);else onFind(null);}start=null;};
 container.querySelectorAll('[data-target]').forEach(b=>{b.onclick=()=>onFind(data.targets.find(t=>t.id===b.dataset.target));});
}
