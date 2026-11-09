import {createAnalytics} from './analytics.mjs';
import {upgradeEnquiryCopy} from './release-copy.mjs';
import {clientIp} from './request-policy.mjs';
import {addCompanyNews} from './company-news.mjs';
import {upgradeServices} from './service-content.mjs';
import {ENQUIRY_SERVICE_IDS} from './public/services.js';
import {createTranslationService,contentVersion} from './translation.mjs';
import {createContentWriter} from './content-sync.mjs';
import {cleanArticleHtml,importArticleHtml} from './article-html.mjs';
import {createMediaStore} from './media-store.mjs';
import {createReadStream} from 'node:fs';
import {videoRange} from './video-range.mjs';
import {completeGuides,GUIDE_LIBRARY_VERSION} from './article-content.mjs';
import http from 'node:http';
import {LANGUAGES, REQUIRED_LANGUAGES, getPublicLanguages, getDefaultLanguage} from './public/languages.js';
import {readFile, mkdir, writeFile, stat} from 'node:fs/promises';
import {join, dirname, extname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes, scryptSync, timingSafeEqual, createHash, randomUUID} from 'node:crypto';
import {settings as defaults, articles as sampleArticles} from './seed.mjs';
const root=dirname(fileURLToPath(import.meta.url));
const dataDir=process.env.DATA_DIR ? resolve(process.env.DATA_DIR) : join(root,'data');
await mkdir(dataDir,{recursive:true});
await mkdir(join(dataDir,'uploads'),{recursive:true});
const db=new DatabaseSync(join(dataDir,'barsan.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS article_content_backups (migration TEXT NOT NULL, article_id TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(migration,article_id));
CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset INTEGER NOT NULL);`);
if(!db.prepare('SELECT id FROM config WHERE id=1').get()){
 db.prepare('INSERT INTO config VALUES(1,?)').run(JSON.stringify(defaults));
 for(const a of sampleArticles)db.prepare('INSERT INTO articles VALUES(?,?,?)').run(a.id,a.slug,JSON.stringify(a));
}
// Add development translations without replacing any existing content or records.
db.exec('BEGIN IMMEDIATE');
try {
 const stored = JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value);
 for(const language of Object.keys(defaults.ui)) stored.ui[language] = {...defaults.ui[language], ...stored.ui[language]};
 stored.media ||= {};
 stored.enabledLanguages=getPublicLanguages(stored);
 stored.defaultLanguage=getDefaultLanguage(stored);
 db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(stored));
 for (const row of db.prepare('SELECT id,value FROM articles').all()) {
  const article = JSON.parse(row.value);
  const sample = sampleArticles.find(a => a.slug === article.slug);
  for (const field of ['title', 'excerpt', 'body']) {
   if (article[field].zh === undefined) article[field].zh = sample && article[field].en === sample[field].en ? sample[field].zh : '';
  }
  db.prepare('UPDATE articles SET value=? WHERE id=?').run(JSON.stringify(article),row.id);
 }
 db.exec('COMMIT');
} catch (error) { db.exec('ROLLBACK'); throw error; }
// Upgrade only the three existing demo guides once; keep IDs and later edits.
if(!db.prepare('SELECT id FROM migrations WHERE id=?').get(GUIDE_LIBRARY_VERSION)){
 db.exec('BEGIN IMMEDIATE');
 try {
  for(const guide of completeGuides){
   const row=db.prepare('SELECT id,value FROM articles WHERE slug=?').get(guide.slug);
   if(!row)continue;
   const existing=JSON.parse(row.value);
   if(!existing.demo)continue;
   db.prepare('INSERT OR IGNORE INTO article_content_backups VALUES(?,?,?)').run(GUIDE_LIBRARY_VERSION,row.id,row.value);
   const updated={...existing,...structuredClone(guide),id:row.id,status:existing.status,demo:false,date:'2026-10-30',contentVersion:GUIDE_LIBRARY_VERSION};
   db.prepare('UPDATE articles SET value=? WHERE id=?').run(JSON.stringify(updated),row.id);
  }
  db.prepare('INSERT INTO migrations VALUES(?)').run(GUIDE_LIBRARY_VERSION);
  db.exec('COMMIT');
 }catch(error){db.exec('ROLLBACK');throw error;}
}
upgradeServices(db);
addCompanyNews(db);
upgradeEnquiryCopy(db);
const languageRoute = new RegExp('^/(' + LANGUAGES.join('|') + ')(/(services|about|news|contact|quote|privacy)(/[a-z0-9-]+)?)?/?$');
const hashPassword=p=>{const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(p,salt,64).toString('hex');};
const verifyPassword=(p,h)=>{const [salt,hex]=h.split(':');const actual=scryptSync(p,salt,64);const expected=Buffer.from(hex,'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);};
const production=process.env.NODE_ENV==='production';
if(!db.prepare('SELECT username FROM admins LIMIT 1').get()){
 const p=process.env.ADMIN_PASSWORD||randomBytes(15).toString('base64url');
 if(production&&(!process.env.ADMIN_PASSWORD||p.length<16))throw new Error('Production first run requires ADMIN_PASSWORD (at least 16 characters).');
 db.prepare('INSERT INTO admins VALUES(?,?)').run('admin',hashPassword(p));
 if(!production)await writeFile(join(root,'LOCAL_ACCESS.md'),`# 本地后台登录\n\n地址：http://127.0.0.1:${process.env.PORT||3000}/admin\n\n用户名：\`admin\`\n\n初始密码：\`${p}\`\n\n此文件仅供本地使用，不要公开或提交到 Git。可在后台「账户安全」修改密码。\n`,{mode:0o600});
}
const config=()=>JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value);
const articles=()=>db.prepare('SELECT value FROM articles').all().map(a=>JSON.parse(a.value)).sort((a,b)=>b.date.localeCompare(a.date));
const digest=t=>createHash('sha256').update(t).digest('hex');
const cookie=req=>(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('barsan_session='))?.slice(15)||'';
function authenticated(req){return !!db.prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(digest(cookie(req)),Date.now());}
function fail(status,message){throw Object.assign(new Error(message),{status});}
function limit(key,max,windowMs){const now=Date.now();const r=db.prepare('SELECT count,reset FROM limits WHERE key=?').get(key);if(r&&r.reset>now){if(r.count>=max)fail(429,'Too many attempts. Please try again later.');db.prepare('UPDATE limits SET count=count+1 WHERE key=?').run(key);}else db.prepare('INSERT OR REPLACE INTO limits VALUES(?,1,?)').run(key,now+windowMs);}
function json(res,status,value,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(value));}
async function body(req,max=300000){let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>max)fail(413,'Request too large');chunks.push(chunk);}try{const value=JSON.parse(Buffer.concat(chunks).toString()||'{}');if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'JSON object required');return value;}catch{fail(400,'Invalid JSON object');}}
function str(v,max=500){if(typeof v!=='string'||v.length>max)fail(400,'Invalid field');return v.trim();}
function trans(v,max){if(!v||typeof v!=='object')fail(400,'Missing translations');return Object.fromEntries([...REQUIRED_LANGUAGES,'zh'].map(l=>[l,str(v[l]||'',max)]));}
function validateArticle(b,id,{allowMissingTranslations=false}={}){const formats=Object.fromEntries([...REQUIRED_LANGUAGES,'zh'].map(l=>[l,b.bodyFormat?.[l]||'text']));if(Object.values(formats).some(f=>!['text','html'].includes(f)))fail(400,'Invalid article format');const a={id,slug:str(b.slug,120),category:str(b.category,30),date:str(b.date,10),status:b.status,demo:!!b.demo,cover:str(b.cover||'',150),title:trans(b.title,250),excerpt:trans(b.excerpt,800),body:trans(b.body,60000),bodyFormat:formats};for(const l of Object.keys(formats))if(formats[l]==='html')a.body[l]=cleanArticleHtml(a.body[l]);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)||!['draft','published'].includes(a.status)||!['guide','ocean','company','update'].includes(a.category)||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!Number.isFinite(Date.parse(a.date+'T00:00:00Z'))||new Date(a.date+'T00:00:00Z').toISOString().slice(0,10)!==a.date)fail(400,'Invalid article fields');if(a.cover&&!/^\/media\/[a-f0-9]{32}\.(jpg|png|webp)$/.test(a.cover)&&!/^\/assets\/(port|service-(sea|air|customs|delivery|land|warehouse|ddp))\.jpg$/.test(a.cover))fail(400,'Invalid cover image');if(!allowMissingTranslations&&a.status==='published'&&REQUIRED_LANGUAGES.some(l=>!a.title[l]||!a.excerpt[l]||!a.body[l]))fail(400,'Publishing requires title, excerpt and body in all three languages.');return a;}
function validateConfig(b){const c={company:str(b.company,150),email:str(b.email,150),phone:str(b.phone,60),whatsapp:str(b.whatsapp,30),address:str(b.address,600),defaultLanguage:b.defaultLanguage,enabledLanguages:b.enabledLanguages??getPublicLanguages(config()),ui:{},media:validateMedia(b.media ?? config().media ?? {})};if(!Array.isArray(c.enabledLanguages)||!c.enabledLanguages.length||c.enabledLanguages.some(l=>!LANGUAGES.includes(l))||new Set(c.enabledLanguages).size!==c.enabledLanguages.length)fail(400,'请至少选择一种有效的前台语言');c.enabledLanguages=LANGUAGES.filter(l=>c.enabledLanguages.includes(l));if(!c.enabledLanguages.includes(c.defaultLanguage))fail(400,'默认语言必须是已开启的前台语言');if(!c.company||!LANGUAGES.includes(c.defaultLanguage)||c.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)||c.whatsapp&&!/^\+?\d{7,16}$/.test(c.whatsapp))fail(400,'Check company, email, WhatsApp or language fields.');for(const l of [...REQUIRED_LANGUAGES,'zh']){c.ui[l]={};for(const k of Object.keys(defaults.ui.en)){const s=str(b.ui?.[l]?.[k] ?? config().ui?.[l]?.[k],6000);if(!s)fail(400,`Translation required: ${l}.${k}`);c.ui[l][k]=s;}}return c;}
const mediaKeys=['logo','hero','about','newsDefault','service-sea','service-air','service-customs','service-delivery','service-land','service-warehouse','service-ddp','heroVideo'];
function validateMedia(value){if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'Invalid media settings');const media={};for(const [key,path] of Object.entries(value)){if(!mediaKeys.includes(key))fail(400,'Unknown image field');const src=str(path,180);if(key==='heroVideo'){if(src&&!/^\/media\/[a-f0-9]{32}\.mp4$/.test(src)&&src!=='/assets/hero-ship-loop.mp4')fail(400,'Invalid video path');if(src)media[key]=src;continue;}if(src&&!/^\/media\/[a-f0-9]{32}\.(png|jpg|webp)$/.test(src)&&!/^\/assets\/(logo\.png|port\.jpg|hero-ship-poster\.jpg|service-(sea|air|customs|delivery|land|warehouse|ddp)\.jpg)$/.test(src))fail(400,'Invalid image path');if(src)media[key]=src;}return media;}
const analytics=createAnalytics({db,getSettings:config,getArticles:articles});
analytics.cleanup();
const analyticsCleanup=setInterval(()=>{try{analytics.cleanup();}catch(error){console.error('Analytics cleanup failed:',error.message);}},6*3600000);
analyticsCleanup.unref();
const mediaStore=createMediaStore({db,root,dataDir});
const translation=createTranslationService({db,dataDir});
const siteStreams=new Set();
function broadcastSiteUpdate(){for(const stream of siteStreams)if(!stream.writableEnded&&!stream.destroyed)stream.write('event: site-update\ndata: {}\n\n');}
const contentWriter=createContentWriter({db,translation,validateArticle,validateConfig,onSaved:broadcastSiteUpdate});
async function adminData(){
 const settings=config(),items=articles();
 return {settings,articles:items,translation:await translation.status(),versions:{settings:contentVersion(settings),articles:Object.fromEntries(items.map(a=>[a.id,contentVersion(a)]))},enquiries:db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all().map(q=>({id:q.id,createdAt:q.created_at,...JSON.parse(q.value)}))};
}
const server=http.createServer(async(req,res)=>{
 const headers={'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"};for(const [k,v]of Object.entries(headers))res.setHeader(k,v);
 const method=req.method;const ip=clientIp(req,process.env.TRUST_PROXY==='1');
 try{
 let url;try{url=new URL(req.url,'http://localhost');}catch{fail(400,'Invalid request URL');}const path=url.pathname;
 if(path==='/healthz'&&['GET','HEAD'].includes(method)){db.prepare('SELECT 1').get();return json(res,200,{ok:true});}
 if(path.startsWith('/api/')){
  if(!['GET','HEAD'].includes(method)){
   const origin=req.headers.origin;
   if(origin){let h;try{h=new URL(origin).host;}catch{fail(403,'Invalid origin');}if(h!==req.headers.host)fail(403,'Cross-origin write blocked');}
   if(!String(req.headers['content-type']).startsWith('application/json'))fail(415,'JSON content type required');
  }
  if(path==='/api/site/events'&&method==='GET'){
   res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
   siteStreams.add(res);res.write('event: site-update\ndata: {}\n\n');
   const heartbeat=setInterval(()=>res.write(': keep-alive\n\n'),25000);heartbeat.unref();
   req.on('close',()=>{clearInterval(heartbeat);siteStreams.delete(res);});return;
  }
  if(path==='/api/site'&&method==='GET')return json(res,200,{settings:config(),articles:articles().filter(a=>a.status==='published'&&a.date<=new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Casablanca'}))});
  if(path==='/api/site/visit'&&method==='POST'){
   limit('analytics:'+ip,600,600000);const value=await body(req,3000);const recorded=analytics.record(value,{ip,userAgent:req.headers['user-agent']||'',admin:authenticated(req),host:req.headers.host});return json(res,202,{recorded});
  }
  if(path==='/api/enquiries'&&method==='POST'){
   limit('enquiry:'+ip,10,3600000);const b=await body(req);if(b.website)return json(res,200,{id:'received'});
   const a={name:str(b.name,120),company:str(b.company||'',150),email:str(b.email,150),phone:str(b.phone,60),origin:str(b.origin,200),destination:str(b.destination,200),transport:str(b.transport,50),cargo:str(b.cargo,5000),language:str(b.language,3),consent:b.consent===true,status:'new'};
   if(!a.name||!a.phone||!a.origin||!a.destination||!a.cargo||!a.consent||!ENQUIRY_SERVICE_IDS.includes(a.transport)||!LANGUAGES.includes(a.language)||!/^\S+@\S+\.\S+$/.test(a.email))fail(400,'Please complete all required fields.');
   const id='BIF-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+randomBytes(4).toString('hex').toUpperCase();db.prepare('INSERT INTO enquiries VALUES(?,?,?)').run(id,new Date().toISOString(),JSON.stringify(a));return json(res,201,{id});
  }
  if(path==='/api/admin/login'&&method==='POST'){
   limit('login:'+ip,12,900000);const b=await body(req);const username=str(b.username,80);const p=str(b.password,256);const user=db.prepare('SELECT hash FROM admins WHERE username=?').get(username);
   if(!user||!verifyPassword(p,user.hash))fail(401,'用户名或密码不正确');
   const token=randomBytes(32).toString('hex');db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?)').run(digest(token),Date.now()+8*3600000);
   return json(res,200,{ok:true},{'Set-Cookie':`barsan_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${production?'; Secure':''}`});
  }
  if(path.startsWith('/api/admin/')){
   if(!authenticated(req))fail(401,'请先登录');
   if(path==='/api/admin/session'&&method==='GET')return json(res,200,{ok:true});
   if(path==='/api/admin/logout'&&method==='POST'){db.prepare('DELETE FROM sessions WHERE token=?').run(digest(cookie(req)));return json(res,200,{ok:true},{'Set-Cookie':'barsan_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});}
   if(path==='/api/admin/media'&&method==='GET')return json(res,200,{assets:await mediaStore.list()});
   if(path==='/api/admin/media'&&method==='POST')return json(res,201,await mediaStore.upload(await body(req,17000000)));
   if(path==='/api/admin/media'&&method==='PATCH')return json(res,200,await mediaStore.update(await body(req)));
   if(path==='/api/admin/articles/import-html'&&method==='POST'){
    const b=await body(req,17000000);if(typeof b.html!=='string'||!b.html.trim()||b.html.length>12000000)fail(400,'请选择有效 HTML 文件，最大 12MB');
    return json(res,200,await importArticleHtml(b.html,{imageMap:b.imageMap&&typeof b.imageMap==='object'?b.imageMap:{},upload:mediaStore.upload}));
   }
   if(path==='/api/admin/translation'&&method==='GET')return json(res,200,await translation.status());
   if(path==='/api/admin/translation'&&method==='PUT')return json(res,200,await translation.saveConfig(await body(req)));
   if(path==='/api/admin/translation/test'&&method==='POST'){
    const sample=await translation.translate({sourceLanguage:'zh',text:'我们为您的货物协调国际运输和摩洛哥本地派送。',maxLength:800});
    return json(res,200,{ok:true,sample});
   }
   if(path==='/api/admin/analytics'&&method==='GET')return json(res,200,analytics.stats(Number(url.searchParams.get('days')||7),Number(url.searchParams.get('page')||1)));
   if(path==='/api/admin/data'&&method==='GET')return json(res,200,await adminData());
   if(path==='/api/admin/languages'&&method==='PUT'){const b=await body(req);await contentWriter.saveSettings({...config(),enabledLanguages:b.enabledLanguages,defaultLanguage:b.defaultLanguage,baseVersion:b.baseVersion});return json(res,200,await adminData());}
   if(path==='/api/admin/content'&&method==='PUT'){
    await contentWriter.saveVisual(await body(req,12000000));return json(res,200,await adminData());
   }
   if(path==='/api/admin/settings'&&method==='PUT'){
    await contentWriter.saveSettings(await body(req,1200000));return json(res,200,{ok:true});
   }
   if(path==='/api/admin/articles'&&method==='POST'){
    const a=await contentWriter.saveArticle(await body(req,1200000),randomUUID(),true);return json(res,201,a);
   }
   if(path.startsWith('/api/admin/articles/')){
    const id=decodeURIComponent(path.slice('/api/admin/articles/'.length));if(!db.prepare('SELECT id FROM articles WHERE id=?').get(id))fail(404,'文章不存在');
    if(method==='PUT')return json(res,200,await contentWriter.saveArticle(await body(req,1200000),id));
    if(method==='DELETE'){db.prepare('DELETE FROM articles WHERE id=?').run(id);broadcastSiteUpdate();return json(res,200,{ok:true});}
   }
   if(path.startsWith('/api/admin/enquiries/')&&method==='PATCH'){const id=decodeURIComponent(path.slice('/api/admin/enquiries/'.length));const q=db.prepare('SELECT value FROM enquiries WHERE id=?').get(id);if(!q)fail(404,'询价不存在');const b=await body(req);if(!['new','contacted','quoted','closed'].includes(b.status))fail(400,'Invalid status');db.prepare('UPDATE enquiries SET value=? WHERE id=?').run(JSON.stringify({...JSON.parse(q.value),status:b.status}),id);return json(res,200,{ok:true});}
   if(path==='/api/admin/password'&&method==='PUT'){const b=await body(req);const current=str(b.current,256);const next=str(b.next,256);if(next.length<16)fail(400,'新密码至少需要 16 个字符');const u=db.prepare('SELECT * FROM admins LIMIT 1').get();if(!verifyPassword(current,u.hash))fail(400,'当前密码不正确');db.prepare('UPDATE admins SET hash=? WHERE username=?').run(hashPassword(next),u.username);db.exec('DELETE FROM sessions');return json(res,200,{ok:true},{'Set-Cookie':'barsan_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});}
  }
  fail(404,'API not found');
 }
 if(!['GET','HEAD'].includes(method))fail(405,'Method not allowed');
 if(languageRoute.test(path)){const settings=config(),requested=path.split('/')[1];if(!getPublicLanguages(settings).includes(requested)){res.writeHead(302,{'Location':path.replace('/'+requested,'/'+getDefaultLanguage(settings))+url.search,'Cache-Control':'no-store'});res.end();return;}}
 let file;if(path.startsWith('/admin/preview/')){if(!authenticated(req))fail(401,'请先登录后台');if(!languageRoute.test(path.slice('/admin/preview'.length)))fail(404,'Not found');res.setHeader('X-Frame-Options','SAMEORIGIN');res.setHeader('Content-Security-Policy',headers['Content-Security-Policy'].replace("frame-ancestors 'none'","frame-ancestors 'self'"));res.setHeader('X-Robots-Tag','noindex, nofollow');file=join(root,'public/index.html');}else if(/^\/media\/[a-f0-9]{32}\.(jpg|png|webp|mp4)$/.test(path))file=join(dataDir,'uploads',path.slice(7));else if(path==='/admin'||path==='/admin/')file=join(root,'public/admin.html');else if(['/analytics-panel.js','/site-extras.js','/services.js','/language-settings.js','/translation-settings.js','/article-format.js','/article-policy.js','/media-library.js','/visual-editor.js','/visual-preview.js','/visual-preview.css','/visual-editor.css'].includes(path)||path==='/languages.js'||path==='/style.css'||path==='/app.js'||path==='/admin.js'||path==='/admin.css')file=join(root,'public',path);else if(path==='/vendor/purify.es.mjs')file=join(root,'public/vendor/purify.es.mjs');else if(path.startsWith('/assets/')){const normalized=resolve(root,'public','.'+decodeURIComponent(path));if(!normalized.startsWith(join(root,'public/assets')+'/'))fail(404,'Not found');file=normalized;}else if(languageRoute.test(path)||path==='/')file=join(root,'public/index.html');else fail(404,'Not found');
 const s=await stat(file).catch(()=>fail(404,'Not found'));const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml'};const contentHeaders={'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':s.size,'Cache-Control':['.html','.js','.mjs','.css'].includes(extname(file))?'no-cache':'public, max-age=3600'};
 if(extname(file)==='.mp4'){
  const range=videoRange(req.headers.range,s.size);res.setHeader('Accept-Ranges','bytes');
  if(!range){res.writeHead(416,{'Content-Range':`bytes */${s.size}`,'Content-Length':'0'});return res.end();}
  contentHeaders['Content-Length']=range.end-range.start+1;
  if(range.partial)contentHeaders['Content-Range']=`bytes ${range.start}-${range.end}/${s.size}`;
  res.writeHead(range.partial?206:200,contentHeaders);
  if(method==='HEAD')return res.end();
  createReadStream(file,{start:range.start,end:range.end}).on('error',()=>res.destroy()).pipe(res);return;
 }
 res.writeHead(200,contentHeaders);res.end(method==='HEAD'?undefined:await readFile(file));
 }catch(e){if(res.headersSent)return res.end();const status=e.status||(e.code?.includes('CONSTRAINT')||(Number(e.errcode)&255)===19?409:500);json(res,status,{error:status===409?(e.status===409?e.message:'URL slug already exists'):status===500?'Server error':e.message});if(status===500)console.error(e);}
});
server.listen(Number(process.env.PORT||3000),process.env.HOST||'127.0.0.1',()=>console.log(`Barsan local server: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3000}\nAdmin: /admin (local credentials: LOCAL_ACCESS.md)`));
process.on('SIGTERM',()=>{for(const stream of siteStreams)stream.end();server.close(()=>{db.close();process.exit(0);});});
