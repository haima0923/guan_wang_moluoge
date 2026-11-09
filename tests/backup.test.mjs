import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile,readdir,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';

test('online backup retains committed WAL data, uploaded files and private translation settings',async()=>{
 const data=await mkdtemp(join(tmpdir(),'barsan-backup-')),output=join(data,'private-backups');await mkdir(join(data,'uploads'));
 const db=new DatabaseSync(join(data,'barsan.sqlite'));db.exec("PRAGMA journal_mode=WAL;CREATE TABLE content(id INTEGER PRIMARY KEY,value TEXT);INSERT INTO content VALUES(1,'committed while server is open')");
 await writeFile(join(data,'uploads','test.jpg'),'fixture-image');await writeFile(join(data,'translation-config.json'),JSON.stringify({apiKey:'fixture-private-key'}),{mode:0o600});
 try{
  const result=spawnSync(process.execPath,[new URL('../scripts/backup.mjs',import.meta.url).pathname],{env:{...process.env,DATA_DIR:data,BACKUP_DIR:output},encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const folders=await readdir(output);assert.equal(folders.length,1);const directory=join(output,folders[0]);assert.ok(!(await readdir(directory)).some(name=>name.endsWith('-wal')||name.endsWith('-shm')));
  const restored=new DatabaseSync(join(directory,'barsan.sqlite'),{readOnly:true});try{assert.equal(restored.prepare('SELECT value FROM content').get().value,'committed while server is open');}finally{restored.close();}
  assert.equal(await readFile(join(directory,'uploads','test.jpg'),'utf8'),'fixture-image');assert.equal(JSON.parse(await readFile(join(directory,'translation-config.json'),'utf8')).apiKey,'fixture-private-key');
  assert.equal((await stat(directory)).mode&0o777,0o700);assert.equal((await stat(join(directory,'translation-config.json'))).mode&0o777,0o600);
 }finally{db.close();await rm(data,{recursive:true,force:true});}
});
