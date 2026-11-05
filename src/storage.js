export const KEY='renmei-explorer-v1';
export const blank=()=>({version:1,intro:false,backpack:false,selected:[],stations:{},completedAt:null});
export function load(storage=globalThis.localStorage){try{const x=JSON.parse(storage.getItem(KEY));if(!x||x.version!==1)return blank();return {...blank(),...x,stations:x.stations&&typeof x.stations==='object'?x.stations:{},selected:Array.isArray(x.selected)?x.selected:[]};}catch{return blank();}}
export function persist(state,storage=globalThis.localStorage){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function station(state,id){return state.stations[id]??={found:[],answers:[],complete:false};}
export function completeStation(state,id,treasure,questions){const s=station(state,id);if(treasure.status!=='ready'||treasure.kind!=='photo'||!treasure.targets.length||!treasure.targets.every(t=>s.found.includes(t.id))||!questions.every(q=>s.answers.includes(q.id)))return false;s.complete=true;s.completedAt??=new Date().toISOString();return true;}
export const completedCount=state=>Object.values(state.stations).filter(s=>s.complete).length;
