import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import net from 'node:net';
import {randomUUID} from 'node:crypto';
const root=new URL('..',import.meta.url).pathname;
async function fixture(run){
 const dir=await mkdtemp(join(tmpdir(),'barsan-release-')),port=19000+Math.floor(Math.random()*1000),base='http://127.0.0.1:'+port;
 const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),HOST:'127.0.0.1',DATA_DIR:dir,NODE_ENV:'production',ADMIN_PASSWORD:'Release-fixture-password-2026',TRUST_PROXY:'1',DASHSCOPE_API_KEY:'',QWEN_BASE_URL:'',QWEN_MODEL:''},stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Startup timeout')),7000);child.stdout.on('data',data=>{if(String(data).includes('Barsan local server')){clearTimeout(timer);resolve();}});child.once('exit',()=>{clearTimeout(timer);reject(Error('Startup failed'));});});
  await run({base,port,child});
 }finally{if(child.exitCode===null){await new Promise(resolve=>{child.once('exit',resolve);child.kill('SIGTERM');});}await rm(dir,{recursive:true,force:true});}
}
function raw(port,target){return new Promise((resolve,reject)=>{const socket=net.connect(port,'127.0.0.1');let output='';socket.setTimeout(3000,()=>socket.destroy(Error('Timeout')));socket.once('connect',()=>socket.write('GET '+target+' HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n'));socket.on('data',data=>output+=data);socket.once('error',reject);socket.once('end',()=>resolve(output));});}

test('malformed request targets return an error without stopping the production server',()=>fixture(async({base,port})=>{
 assert.match(await raw(port,'http://['),/^HTTP\/1\.1 400 /);
 assert.equal((await fetch(base+'/api/site')).status,200);assert.deepEqual(await (await fetch(base+'/healthz')).json(),{ok:true});
 for(const data of [null,[],42]){
  const r=await fetch(base+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':'192.0.2.8'},body:JSON.stringify(data)});assert.equal(r.status,400);
 }
}));

test('HTTPS proxy clients have independent enquiry limits and request metadata stays private',()=>fixture(async({base})=>{
 const enquiry={name:'Release QA',email:'release@example.com',phone:'+212600000000',origin:'Guangzhou',destination:'Casablanca',transport:'sea',cargo:'Isolated release test',language:'en',consent:true};
 const submit=ip=>fetch(base+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':ip},body:JSON.stringify(enquiry)});
 for(let i=1;i<=12;i++)assert.equal((await submit('192.0.2.'+i)).status,201);
 for(let i=1;i<=9;i++)assert.equal((await submit('192.0.2.1')).status,201);
 assert.equal((await submit('192.0.2.1')).status,429);assert.equal((await submit('198.51.100.1')).status,201);
 for(const path of ['/data/barsan.sqlite','/data/translation-config.json','/LOCAL_ACCESS.md','/.env','/server.mjs'])assert.equal((await fetch(base+path)).status,404);
 assert.equal((await fetch(base+'/api/admin/data')).status,401);
 const login=await fetch(base+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':'203.0.113.5'},body:JSON.stringify({username:'admin',password:'Release-fixture-password-2026'})});
 assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/HttpOnly; SameSite=Strict;.*Secure/);
}));

test('forwarded addresses are ignored by default and trusted proxies use the actual final address',async()=>{
 const {clientIp}=await import('../request-policy.mjs');
 const request={socket:{remoteAddress:'::ffff:127.0.0.1'},headers:{'x-forwarded-for':'198.51.100.4, 203.0.113.8'}};
 assert.equal(clientIp(request),'127.0.0.1');assert.equal(clientIp(request,true),'203.0.113.8');
 request.headers['x-forwarded-for']='invalid';assert.equal(clientIp(request,true),'127.0.0.1');
});

test('analytics API protects visitor details, rejects cross-origin writes and excludes authenticated browsing',()=>fixture(async({base})=>{
 const headers={'Content-Type':'application/json','User-Agent':'Mozilla/5.0','X-Forwarded-For':'8.8.8.8'};
 const value={eventId:randomUUID(),visitorId:randomUUID(),path:'/en/news/shipping-document-checklist',referrer:'https://search.example/?secret=discard'};
 const submit=(extra={},data=value)=>fetch(base+'/api/site/visit',{method:'POST',headers:{...headers,...extra},body:JSON.stringify(data)});
 assert.equal((await fetch(base+'/api/admin/analytics')).status,401);
 assert.equal((await submit({Origin:'https://wrong.example'})).status,403);
 assert.equal((await submit({}, {...value,visitorId:'untrusted'})).status,400);
 assert.deepEqual(await (await submit()).json(),{recorded:true});
 assert.deepEqual(await (await submit()).json(),{recorded:false});
 const login=await fetch(base+'/api/admin/login',{method:'POST',headers,body:JSON.stringify({username:'admin',password:'Release-fixture-password-2026'})});
 const cookie=login.headers.get('set-cookie').split(';')[0];
 assert.deepEqual(await (await submit({Cookie:cookie},{...value,eventId:randomUUID()})).json(),{recorded:false});
 const result=await fetch(base+'/api/admin/analytics?days=1',{headers:{Cookie:cookie}}),stats=await result.json();
 assert.equal(result.status,200);assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal(stats.summary.views,1);assert.equal(stats.recent[0].ip,'8.8.8.8');assert.equal(stats.recent[0].country,'US');assert.equal(stats.recent[0].referrer,'search.example');
 const publicData=JSON.stringify(await (await fetch(base+'/api/site')).json());assert.ok(!publicData.includes('8.8.8.8'));assert.ok(!publicData.includes(value.visitorId));
 assert.equal((await fetch(base+'/api/admin/analytics?days=1000',{headers:{Cookie:cookie}})).status,400);
 for(const path of ['/analytics.mjs','/geoip/dbip-country.mmdb'])assert.equal((await fetch(base+path)).status,404);
}));

test('production enquiry text upgrades only unchanged starter copy and retains administrator edits',async()=>{
 const {DatabaseSync}=await import('node:sqlite');const {settings}=await import('../seed.mjs');const {upgradeEnquiryCopy,enquirySuccessCopy}=await import('../release-copy.mjs');
 const db=new DatabaseSync(':memory:');
 try{
  db.exec('CREATE TABLE migrations(id TEXT PRIMARY KEY);CREATE TABLE config(id INTEGER PRIMARY KEY,value TEXT NOT NULL)');
  const config=structuredClone(settings);config.ui.en.successDetail='Keep this reference for follow-up. This local preview does not send email or WhatsApp notifications.';config.ui.zh.successDetail='用户自行修改的询价提示';
  db.prepare('INSERT INTO config VALUES(1,?)').run(JSON.stringify(config));upgradeEnquiryCopy(db);
  const saved=JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value);assert.equal(saved.ui.en.successDetail,enquirySuccessCopy.en);assert.equal(saved.ui.zh.successDetail,'用户自行修改的询价提示');
  saved.ui.en.successDetail='Later edit';db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(saved));upgradeEnquiryCopy(db);assert.equal(JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value).ui.en.successDetail,'Later edit');
 }finally{db.close();}
});
