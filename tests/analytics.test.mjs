import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {randomUUID} from 'node:crypto';
import {createAnalytics,createCountryLookup,dayAt} from '../analytics.mjs';
import {whatsappButton} from '../public/site-extras.js';

function fixture(){
 const db=new DatabaseSync(':memory:');let clock=new Date('2026-11-06T12:00:00Z');
 const settings={enabledLanguages:['en','fr','ary'],defaultLanguage:'en'};
 const article={id:'article-1',slug:'shipping-guide',status:'published',date:'2026-10-01',title:{en:'Guide',zh:'发货指南'}};
 const analytics=createAnalytics({db,getSettings:()=>settings,getArticles:()=>[article],lookupCountry:ip=>ip==='8.8.8.8'?'US':'',now:()=>clock});
 return {db,analytics,article,setDate:d=>clock=new Date(d),context:{ip:'8.8.8.8',userAgent:'Mozilla/5.0',host:'ma.barsan.com.cn'}};
}
const visit=(path,visitorId=randomUUID())=>({path,eventId:randomUUID(),visitorId});
test('visits deduplicate retries; visitors and multilingual article counts are distinct',()=>{
 const f=fixture(),visitor=randomUUID(),first=visit('/en',visitor);
 try{
  assert.equal(f.analytics.record(first,f.context),true);assert.equal(f.analytics.record(first,f.context),false);
  f.analytics.record(visit('/en/news/shipping-guide',visitor),f.context);
  f.analytics.record(visit('/fr/news/shipping-guide',visitor),f.context);
  f.analytics.record(visit('/en/news/shipping-guide'),f.context);
  const stats=f.analytics.stats(1);assert.equal(stats.summary.views,4);assert.equal(stats.summary.visitors,2);
  assert.equal(stats.articles[0].views,3);assert.equal(stats.articles[0].visitors,2);
  assert.equal(stats.countries[0].country,'US');assert.equal(stats.recent[0].ip,'8.8.8.8');
  assert.ok(!JSON.stringify(stats).includes(visitor));
 }finally{f.db.close();}
});
test('excluded paths, drafts, future posts, disabled languages, bots and administrators do not count',()=>{
 const f=fixture();try{
  for(const path of ['/admin','/admin/preview/en','/assets/port.jpg','/zh','/en/news/missing','/en/services/not-a-page','/en?email=secret','/en/news/%61'])assert.equal(f.analytics.record(visit(path),f.context),false,path);
  assert.equal(f.analytics.record(visit('/en'),{...f.context,admin:true}),false);
  assert.equal(f.analytics.record(visit('/en'),{...f.context,userAgent:'Googlebot'}),false);
  f.article.status='draft';assert.equal(f.analytics.record(visit('/en/news/shipping-guide'),f.context),false);
  f.article.status='published';f.article.date='2099-01-01';assert.equal(f.analytics.record(visit('/en/news/shipping-guide'),f.context),false);
  assert.equal(f.analytics.stats(1).summary.views,0);
  assert.throws(()=>f.analytics.record({path:'/en',visitorId:'fake',eventId:randomUUID()},f.context),/identifier/);
 }finally{f.db.close();}
});
test('Morocco dates, source minimization, 90-day retention, empty days and pagination are correct',()=>{
 const f=fixture();try{
  assert.equal(dayAt(new Date('2026-11-06T12:00:00Z')),'2026-11-06');
  f.analytics.record({...visit('/en/'),referrer:'https://search.example/search?private=secret#secret'},f.context);
  f.analytics.record({...visit('/fr'),referrer:'https://ma.barsan.com.cn/en?private=secret'},f.context);
  let s=f.analytics.stats(7);assert.equal(s.trend.length,7);assert.equal(s.trend[0].views,0);
  assert.ok(s.sources.some(x=>x.referrer==='search.example'));assert.ok(!JSON.stringify(s).includes('private=secret'));
  for(let i=0;i<55;i++)f.analytics.record(visit('/en'),f.context);
  s=f.analytics.stats(7,2);assert.equal(s.recent.length,7);assert.equal(s.pagination.pageCount,2);
  assert.throws(()=>f.analytics.stats(500),/range/);assert.throws(()=>f.analytics.stats(7,1.5),/range/);
  f.setDate('2027-02-04T12:00:00Z');assert.equal(f.analytics.stats(90).summary.views,0);
  assert.equal(f.db.prepare('SELECT count(*) n FROM analytics_visits').get().n,0);
 }finally{f.db.close();}
});
test('offline country lookup supports IPv4/IPv6 and never geolocates private addresses',()=>{
 const lookup=createCountryLookup();assert.equal(lookup('8.8.8.8'),'US');assert.match(lookup('2001:4860:4860::8888'),/^[A-Z]{2}$/);
 for(const ip of ['127.0.0.1','10.0.0.1','192.168.1.1','::1','fd01::1','bad-ip'])assert.equal(lookup(ip),'');
});
test('WhatsApp links use configured international digits and do not appear in editor previews',()=>{
 assert.match(whatsappButton('+8615120047575','zh'),/https:\/\/wa.me\/8615120047575/);
 assert.match(whatsappButton('+8615120047575','ary'),/هضر معانا/);
 assert.equal(whatsappButton('','en'),'');assert.equal(whatsappButton('+8615120047575','en',true),'');
 assert.ok(!whatsappButton('javascript:alert(1)','en'));
});
