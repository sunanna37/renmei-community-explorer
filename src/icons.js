const names=['backpack','water','hat','tissue','notebook','pencil','raincoat','game','toy','candy','scooter','school','temple','post','library','health','fire','police','magnifier','sprout'];
export function artIcon(name){const i=names.indexOf(name);if(i<0)return '';return `<span class="storybook-icon" aria-hidden="true" style="--icon-x:${i%4*100/3}%;--icon-y:${Math.floor(i/4)*25}%"></span>`;}
