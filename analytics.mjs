import {createHmac,randomBytes} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {isIP} from 'node:net';
import {Reader} from 'mmdb-lib';
import {getPublicLanguages} from './public/languages.js';

export const ANALYTICS_TIMEZONE='Africa/Casablanca';
export const dayAt=date=>new Intl.DateTimeFormat('en-CA',{timeZone:ANALYTICS_TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export const shiftDay=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const bot=/bot\b|crawler|spider|headless|preview|facebookexternalhit|whatsapp|curl|wget|python|uptime|monitor/i;
const privateIp=ip=>!isIP(ip)||/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|::1$|f[cd][a-f\d]{2}:|fe[89ab][a-f\d]:)/i.test(ip);
export function createCountryLookup(){
 const reader=new Reader(readFileSync(new URL('./geoip/dbip-country.mmdb',import.meta.url)));
 return ip=>{if(privateIp(ip))return '';try{return reader.get(ip)?.country?.iso_code||'';}catch{return '';}};
}
export function createAnalytics({db,getSettings,getArticles,lookupCountry=createCountryLookup(),now=()=>new Date()}){
 db.exec(`CREATE TABLE IF NOT EXISTS analytics_meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS analytics_visits(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,day TEXT NOT NULL,visitor TEXT NOT NULL,path TEXT NOT NULL,article_id TEXT NOT NULL,lang TEXT NOT NULL,ip TEXT NOT NULL,country TEXT NOT NULL,referrer TEXT NOT NULL,device TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS analytics_day_visitor ON analytics_visits(day,visitor);
 CREATE INDEX IF NOT EXISTS analytics_article_day ON analytics_visits(article_id,day);`);
 db.prepare('INSERT OR IGNORE INTO analytics_meta VALUES(?,?)').run('secret',randomBytes(32).toString('hex'));
 db.prepare('INSERT OR IGNORE INTO analytics_meta VALUES(?,?)').run('startedAt',now().toISOString());
 const secret=db.prepare('SELECT value FROM analytics_meta WHERE key=?').get('secret').value;
 const startedAt=db.prepare('SELECT value FROM analytics_meta WHERE key=?').get('startedAt').value;
 let cleanedDay='';
 function cleanup(){const today=dayAt(now());if(cleanedDay!==today){db.prepare('DELETE FROM analytics_visits WHERE day<?').run(shiftDay(today,-89));cleanedDay=today;}return today;}
 function route(path){
  if(typeof path!=='string'||path.length>240||/[?#%]/.test(path))return null;
  const match=/^\/(en|fr|ary|zh)(?:\/(services|about|news|contact|quote|privacy)(?:\/([a-z0-9-]+))?)?\/?$/.exec(path);
  if(!match||!getPublicLanguages(getSettings()).includes(match[1]))return null;
  const [,lang,page='',slug='']=match;
  if(slug&&page!=='news')return null;
  let article;
  if(slug){article=getArticles().find(a=>a.slug===slug&&a.status==='published'&&a.date<=dayAt(now()));if(!article)return null;}
  return {path:`/${lang}${page?'/'+page:''}${slug?'/'+slug:''}`,lang,articleId:article?.id||''};
 }
 function record(value,{ip,userAgent='',admin=false,host=''}){
  if(admin||bot.test(userAgent)||!userAgent)return false;
  if(!uuid.test(value.eventId||'')||!uuid.test(value.visitorId||''))throw Object.assign(Error('Invalid visit identifier'),{status:400});
  const target=route(value.path);if(!target)return false;
  const today=cleanup();let referrer='';
  try{const ref=new URL(value.referrer);if(['https:','http:'].includes(ref.protocol)&&ref.host!==host)referrer=ref.hostname.slice(0,200);}catch{}
  const country=lookupCountry(ip);
  const result=db.prepare('INSERT OR IGNORE INTO analytics_visits VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(value.eventId,now().toISOString(),today,createHmac('sha256',secret).update(value.visitorId).digest('hex'),target.path,target.articleId,target.lang,isIP(ip)?ip:'',/^[A-Z]{2}$/.test(country)?country:'',referrer,/mobile|android|iphone|ipad/i.test(userAgent)?'mobile':'desktop');
  return result.changes===1;
 }
 function stats(days=7,page=1){
  if(![1,7,30,90].includes(days)||!Number.isInteger(page)||page<1||page>100000)throw Object.assign(Error('Invalid analytics range'),{status:400});
  const today=cleanup(),from=shiftDay(today,1-days),range=[from,today];
  const summary=db.prepare('SELECT COUNT(*) views,COUNT(DISTINCT visitor) visitors,COUNT(DISTINCT country) FILTER (WHERE country<>\'\') countries,COUNT(*) FILTER (WHERE article_id<>\'\') articleViews FROM analytics_visits WHERE day BETWEEN ? AND ?').get(...range);
  const todayStats=db.prepare('SELECT COUNT(*) views,COUNT(DISTINCT visitor) visitors FROM analytics_visits WHERE day=?').get(today);
  const daily=db.prepare('SELECT day,COUNT(*) views,COUNT(DISTINCT visitor) visitors FROM analytics_visits WHERE day BETWEEN ? AND ? GROUP BY day ORDER BY day').all(...range);
  const trend=Array.from({length:days},(_,i)=>{const day=shiftDay(from,i);return daily.find(d=>d.day===day)||{day,views:0,visitors:0};});
  const countries=db.prepare('SELECT country,COUNT(*) views,COUNT(DISTINCT visitor) visitors FROM analytics_visits WHERE day BETWEEN ? AND ? GROUP BY country ORDER BY views DESC LIMIT 50').all(...range);
  const sources=db.prepare('SELECT referrer,COUNT(*) views FROM analytics_visits WHERE day BETWEEN ? AND ? GROUP BY referrer ORDER BY views DESC LIMIT 12').all(...range);
  const counts=db.prepare('SELECT article_id,COUNT(*) views,COUNT(DISTINCT visitor) visitors FROM analytics_visits WHERE day BETWEEN ? AND ? AND article_id<>\'\' GROUP BY article_id').all(...range);
  const articles=getArticles().map(a=>({id:a.id,slug:a.slug,title:a.title.zh||a.title.en||a.slug,status:a.status,views:0,visitors:0,...counts.find(c=>c.article_id===a.id)})).sort((a,b)=>b.views-a.views);
  for(const c of counts)if(!articles.some(a=>a.id===c.article_id))articles.push({id:c.article_id,title:'已删除文章',slug:'',...c});
  const total=summary.views,pageCount=Math.max(1,Math.ceil(total/50));page=Math.min(page,pageCount);
  const recent=db.prepare('SELECT created_at createdAt,path,ip,country,referrer,device,lang FROM analytics_visits WHERE day BETWEEN ? AND ? ORDER BY created_at DESC,rowid DESC LIMIT 50 OFFSET ?').all(...range,(page-1)*50);
  return {days,from,to:today,timezone:ANALYTICS_TIMEZONE,startedAt,retentionDays:90,summary,today:todayStats,trend,countries,sources,articles,recent,pagination:{page,pageCount,total,pageSize:50}};
 }
 return {record,stats,cleanup};
}
