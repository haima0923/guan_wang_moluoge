import {DatabaseSync,backup} from 'node:sqlite';
import {mkdir,cp,chmod,stat,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {randomBytes} from 'node:crypto';
const data=resolve(process.env.DATA_DIR||new URL('../data',import.meta.url).pathname);
const parent=resolve(process.env.BACKUP_DIR||join(data,'backups'));
const uploads=join(data,'uploads');
if(parent===uploads||parent.startsWith(uploads+'/'))throw Error('Backup directory must be outside uploads');
await mkdir(parent,{recursive:true,mode:0o700});await chmod(parent,0o700);
const target=join(parent,new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomBytes(3).toString('hex'));
await mkdir(target,{mode:0o700});
const db=new DatabaseSync(join(data,'barsan.sqlite'),{readOnly:true});
try{
 await backup(db,join(target,'barsan.sqlite'));await chmod(join(target,'barsan.sqlite'),0o600);
 await cp(uploads,join(target,'uploads'),{recursive:true});
 const key=join(data,'translation-config.json');
 if(await stat(key).catch(()=>null)){await cp(key,join(target,'translation-config.json'));await chmod(join(target,'translation-config.json'),0o600);}
 const check=new DatabaseSync(join(target,'barsan.sqlite'));
 try{check.exec('PRAGMA journal_mode=DELETE');if(Object.values(check.prepare('PRAGMA quick_check').get())[0]!=='ok')throw Error('Backup integrity check failed');}finally{check.close();}
 await writeFile(join(target,'backup.json'),JSON.stringify({createdAt:new Date().toISOString(),database:'barsan.sqlite',includesUploads:true},null,2),{mode:0o600});
 console.log('Backup verified:',target);
}catch(error){await rm(target,{recursive:true,force:true});throw error;}finally{db.close();}
