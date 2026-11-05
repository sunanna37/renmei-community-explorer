export const items=[
 {id:'water',icon:'💧',name:'水壺',good:true,tip:'水壺可以讓我們隨時補充水分！'},
 {id:'hat',icon:'🧢',name:'帽子',good:true,tip:'帽子可以幫我們遮陽！'},
 {id:'tissue',icon:'🧻',name:'衛生紙',good:true,tip:'需要擦拭時，衛生紙能派上用場！'},
 {id:'notebook',icon:'📒',name:'小筆記本',good:true,tip:'有趣的發現可以記下來喔！'},
 {id:'pencil',icon:'✏️',name:'鉛筆',good:true,tip:'用鉛筆畫下你觀察到的事物！'},
 {id:'raincoat',icon:'🌂',name:'輕便雨具',good:true,tip:'天氣改變時，雨具可以幫我們擋雨！'},
 {id:'game',icon:'🎮',name:'電玩遊戲機',good:false,tip:'今天我們要用眼睛探索社區，遊戲機先留在家裡吧！'},
 {id:'toy',icon:'🧸',name:'大型玩具',good:false,tip:'大型玩具讓背包變重，先留在家裡吧！'},
 {id:'candy',icon:'🍬',name:'一大包糖果',good:false,tip:'這次不需要一大包糖果，留空間給探險工具吧！'},
 {id:'scooter',icon:'🛴',name:'滑板車',good:false,tip:'這次和老師一起步行，滑板車先留在家裡吧！'}];
export function ready(selected){const chosen=items.filter(i=>selected.includes(i.id));return selected.includes('water')&&chosen.filter(i=>i.good).length>=3&&chosen.every(i=>i.good);}
