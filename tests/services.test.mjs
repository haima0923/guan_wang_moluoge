import {test} from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {SERVICE_CATALOG, ENQUIRY_SERVICE_IDS} from '../public/services.js';
import {serviceCopy, upgradeServices, SERVICES_VERSION} from '../service-content.mjs';
import {settings} from '../seed.mjs';

test('six service definitions have complete four-language copy and available photographs',async()=>{
 assert.deepEqual(SERVICE_CATALOG.map(s=>s.id),['sea','air','land','warehouse','customs','ddp']);
 for(const service of SERVICE_CATALOG){
  await access(new URL('../public/assets/service-'+service.id+'.jpg',import.meta.url));
  assert.ok(ENQUIRY_SERVICE_IDS.includes(service.id));
  for(const language of ['en','fr','ary','zh']){
   for(const suffix of ['', 'Text','Label','Tag1','Tag2','Tag3','Tag4'])assert.ok(serviceCopy[language][service.key+suffix]?.trim());
  }
 }
});

test('service upgrade preserves unrelated content, backs up the previous version and runs once',()=>{
 const db=new DatabaseSync(':memory:');
 try{
  db.exec('CREATE TABLE config (id INTEGER PRIMARY KEY,value TEXT);CREATE TABLE migrations (id TEXT PRIMARY KEY)');
  const original=structuredClone(settings);original.email='company@example.com';original.ui.zh.heroTitle='用户修改的首页标题';original.ui.zh.service3='旧清关名称';original.media={'service-sea':'/media/'+('a'.repeat(32))+'.jpg'};
  db.prepare('INSERT INTO config VALUES(1,?)').run(JSON.stringify(original));upgradeServices(db);
  let saved=JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value);
  assert.equal(saved.ui.zh.service3,'报关报检');assert.equal(saved.ui.zh.service5,'集装箱陆运');assert.equal(saved.email,original.email);assert.equal(saved.ui.zh.heroTitle,original.ui.zh.heroTitle);assert.deepEqual(saved.media,original.media);
  assert.deepEqual(JSON.parse(db.prepare('SELECT value FROM config_content_backups WHERE migration=?').get(SERVICES_VERSION).value),original);
  saved.ui.zh.service6Text='后续在后台修改的仓储介绍';db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(saved));upgradeServices(db);
  assert.equal(JSON.parse(db.prepare('SELECT value FROM config WHERE id=1').get().value).ui.zh.service6Text,'后续在后台修改的仓储介绍');
 }finally{db.close();}
});
