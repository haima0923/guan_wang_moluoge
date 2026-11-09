import { WORLD_LAND_PATH } from './world-land.js';

export const mapCopy = {
 en: { eyebrow:'CHINA → WORLDWIDE', title:'Two origins. A world of connections.', yiwu:'Yiwu', guangzhou:'Guangzhou', china:'China', morocco:'MOROCCO', casablanca:'Casablanca', global:'Worldwide connections', focus:'Morocco connections', accessible:'World map showing connections from Yiwu and Guangzhou, China, to global destinations. Both connections to Casablanca, Morocco, are highlighted in orange.' },
 fr: { eyebrow:'CHINE → MONDE', title:'Deux origines. Le monde connecté.', yiwu:'Yiwu', guangzhou:'Guangzhou', china:'Chine', morocco:'MAROC', casablanca:'Casablanca', global:'Connexions mondiales', focus:'Connexions vers le Maroc', accessible:'Carte du monde des connexions depuis Yiwu et Guangzhou, en Chine. Les deux connexions vers Casablanca, au Maroc, sont mises en évidence en orange.' },
 ary: { eyebrow:'من الصين للعالم', title:'من ييوو وكوانزو للعالم.', yiwu:'ييوو', guangzhou:'كوانزو', china:'الصين', morocco:'المغرب', casablanca:'الدار البيضاء', global:'الربط مع العالم', focus:'الربط مع المغرب', accessible:'خريطة العالم كتبين الربط من ييوو وكوانزو فالصين مع وجهات عالمية. الربط مع الدار البيضاء فالمغرب باللون البرتقالي.' },
 zh: { eyebrow:'中国 → 全球', title:'从义乌、广州出发，连接全球。', yiwu:'义乌', guangzhou:'广州', china:'中国', morocco:'摩洛哥', casablanca:'卡萨布兰卡', global:'全球连接线路', focus:'摩洛哥重点线路', accessible:'真实世界底图，标记中国义乌和广州至全球目的地的连接线路。两地至摩洛哥卡萨布兰卡的线路以亮橙色突出显示。' }
};
export const ORIGINS = [
 { id:'yiwu', coordinates:[120.0753,29.3069] },
 { id:'guangzhou', coordinates:[113.26,23.13] }
];
// Representative destinations for a geographic connection overview, not sailing tracks.
export const DESTINATIONS = [
 { id:'morocco', coordinates:[-7.6114,33.5883], name:'Casablanca, Morocco', featured:true },
 { id:'rotterdam', coordinates:[4.48,51.92], name:'Rotterdam' },
 { id:'istanbul', coordinates:[28.98,41.01], name:'Istanbul' },
 { id:'dubai', coordinates:[55.27,25.2], name:'Dubai' },
 { id:'singapore', coordinates:[103.82,1.35], name:'Singapore' },
 { id:'sydney', coordinates:[151.21,-33.87], name:'Sydney' },
 { id:'johannesburg', coordinates:[28.05,-26.2], name:'Johannesburg' },
 { id:'saopaulo', coordinates:[-46.63,-23.55], name:'São Paulo' },
 { id:'newyork', coordinates:[-74.01,40.71], name:'New York' },
 { id:'losangeles', coordinates:[-118.24,34.05], name:'Los Angeles' }
];
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function project([longitude,latitude]) { return [30 + (longitude+180)*2.6, 24+(85-latitude)*2.6]; }
// Spherical interpolation follows great-circle connections. Split at the date line
// so Pacific connections don't draw incorrectly across the entire flat map.
export function connectionPath(from,to) {
 const rad=Math.PI/180;
 const vector=([lon,lat])=>[Math.cos(lat*rad)*Math.cos(lon*rad),Math.cos(lat*rad)*Math.sin(lon*rad),Math.sin(lat*rad)];
 const a=vector(from),b=vector(to);
 const angle=Math.acos(Math.max(-1,Math.min(1,a.reduce((sum,n,i)=>sum+n*b[i],0))));
 let path='',previousLongitude=null;
 for(let i=0;i<=80;i++) {
  const t=i/80,wa=Math.sin((1-t)*angle)/Math.sin(angle),wb=Math.sin(t*angle)/Math.sin(angle);
  const v=a.map((n,j)=>n*wa+b[j]*wb);
  const lon=Math.atan2(v[1],v[0])/rad,lat=Math.atan2(v[2],Math.hypot(v[0],v[1]))/rad;
  const [x,y]=project([lon,lat]);
  path+=(previousLongitude===null||Math.abs(lon-previousLongitude)>180?'M':'L')+x.toFixed(2)+','+y.toFixed(2);
  previousLongitude=lon;
 }
 return path;
}
function graticule() {
 let d='';
 for(let lon=-150;lon<=150;lon+=30){const [x,y]=project([lon,80]);d+=`M${x},${y}V${project([lon,-55])[1]}`;}
 for(let lat=-30;lat<=60;lat+=30){const [x,y]=project([-180,lat]);d+=`M${x},${y}H${project([180,lat])[0]}`;}
 return d;
}
export function routeMapMarkup(language,caption,ui={}) {
 const base=mapCopy[language]||mapCopy.en;
 const c=Object.fromEntries(Object.entries(base).map(([key,value])=>[key,ui['map'+key[0].toUpperCase()+key.slice(1)]||value]));
 const [mx,my]=project(DESTINATIONS[0].coordinates);
 const [yx,yy]=project(ORIGINS[0].coordinates),[gx,gy]=project(ORIGINS[1].coordinates);
 const route=(origin,destination)=>`<path class="freight-route ${destination.featured?'freight-route-focus':'freight-route-global'}" d="${connectionPath(origin.coordinates,destination.coordinates)}"><title>${escape(c[origin.id])} → ${escape(destination.featured?c.casablanca+' · '+c.morocco:destination.name)}</title></path>`;
 const globalRoutes=ORIGINS.map(origin=>DESTINATIONS.filter(d=>!d.featured).map(d=>route(origin,d)).join('')).join('');
 const focusRoutes=ORIGINS.map(origin=>route(origin,DESTINATIONS[0])).join('');
 return `<div class="route-map freight-map"><div class="freight-map-heading"><span data-cms-key="mapEyebrow">${escape(c.eyebrow)}</span><strong data-cms-key="mapTitle">${escape(c.title)}</strong></div><svg class="freight-map-svg" viewBox="0 0 1000 450" role="img" aria-label="${escape(c.accessible)}"><path class="freight-grid" d="${graticule()}"/><path class="freight-land" d="${WORLD_LAND_PATH}" fill-rule="evenodd"/>${globalRoutes}<g class="freight-focus-glow" aria-hidden="true">${focusRoutes}</g>${focusRoutes}${DESTINATIONS.filter(d=>!d.featured).map(d=>{const [x,y]=project(d.coordinates);return `<circle class="freight-destination" cx="${x}" cy="${y}" r="3.6"><title>${escape(d.name)}</title></circle>`;}).join('')}<circle class="freight-morocco-halo" cx="${mx}" cy="${my}" r="17"/><circle class="freight-morocco-pin" cx="${mx}" cy="${my}" r="6.5"/><path class="freight-morocco-leader" d="M${mx},${my+10}v18l-22 13"/><g class="freight-morocco-label" transform="translate(${mx-137},${my+41})"><rect width="172" height="63" rx="6"/><text x="86" y="27" text-anchor="middle">${escape(c.morocco)}</text><text x="86" y="47" text-anchor="middle" class="freight-label-sub">${escape(c.casablanca)}</text></g><g class="freight-origin-pins"><circle cx="${yx}" cy="${yy}" r="5.5"/><circle cx="${gx}" cy="${gy}" r="5.5"/></g><path class="freight-origin-leader" d="M${yx+8},${yy-2}l30 -18h16M${gx+6},${gy+5}l33 26h23"/><g class="freight-origin-label" transform="translate(${yx+54},${yy-44})"><rect width="124" height="44" rx="5"/><text x="62" y="28" text-anchor="middle">${escape(c.yiwu)}</text></g><g class="freight-origin-label" transform="translate(${gx+63},${gy+12})"><rect width="124" height="44" rx="5"/><text x="62" y="28" text-anchor="middle">${escape(c.guangzhou)}</text></g></svg><div class="freight-map-legend"><span><i class="legend-global"></i>${escape(c.global)}</span><span><i class="legend-focus"></i>${escape(c.focus)}</span></div><span class="map-caption" data-cms-key="coverageNote">${escape(caption)}</span><a class="freight-map-source" href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a></div>`;
}
