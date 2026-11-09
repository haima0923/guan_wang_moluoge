import {readdir,stat,writeFile} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {randomBytes} from 'node:crypto';
const builtins=['logo.png','port.jpg','hero-ship-poster.jpg','service-sea.jpg','service-air.jpg','service-customs.jpg','service-delivery.jpg','hero-ship-loop.mp4','service-land.jpg','service-warehouse.jpg','service-ddp.jpg'];
const names={'logo.png':'Barsan 公司 Logo','port.jpg':'集装箱港口','hero-ship-poster.jpg':'首页货轮视频封面','service-sea.jpg':'国际海运','service-air.jpg':'国际空运','service-customs.jpg':'清关文件','service-delivery.jpg':'本地派送','hero-ship-loop.mp4':'首页海上货轮视频','service-land.jpg':'集装箱陆运','service-warehouse.jpg':'仓储服务','service-ddp.jpg':'双清包税 · 装货配送'};
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
export function createMediaStore({db,root,dataDir}){
 db.exec('CREATE TABLE IF NOT EXISTS media_assets (url TEXT PRIMARY KEY, name TEXT NOT NULL, alt TEXT NOT NULL, created_at TEXT NOT NULL)');
 async function list(){
  const stored=new Map(db.prepare('SELECT * FROM media_assets').all().map(a=>[a.url,a]));
  const files=(await readdir(join(dataDir,'uploads'))).filter(n=>/^[a-f0-9]{32}\.(png|jpg|webp|mp4)$/.test(n)).map(n=>({url:'/media/'+n,path:join(dataDir,'uploads',n),source:'upload'}));
  for(const file of builtins)files.push({url:'/assets/'+file,path:join(root,'public/assets',file),source:'builtin'});
  const result=await Promise.all(files.map(async f=>{const info=await stat(f.path).catch(()=>null);if(!info?.isFile())return null;const meta=stored.get(f.url);const filename=f.url.split('/').pop();return {url:f.url,name:meta?.name||names[filename]||filename,alt:meta?.alt||'',kind:extname(filename)==='.mp4'?'video':'image',size:info.size,createdAt:meta?.created_at||info.birthtime.toISOString(),source:f.source};}));
  return result.filter(Boolean).sort((a,b)=>(a.source==='upload'?0:1)-(b.source==='upload'?0:1)||b.createdAt.localeCompare(a.createdAt));
 }
 async function upload({data,name='',alt='',imagesOnly=false}){
  if(typeof data!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(data))fail(400,'无效文件');
  const buffer=Buffer.from(data,'base64');if(buffer.length>12000000||buffer.length<12)fail(400,'文件尺寸不符合要求');
  let ext;if(buffer.toString('ascii',4,8)==='ftyp'&&!imagesOnly)ext='mp4';else if(buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';else if(buffer[0]===255&&buffer[1]===216&&buffer[2]===255)ext='jpg';else if(buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP')ext='webp';else fail(400,'仅支持 PNG、JPEG、WebP 图片或 MP4 视频');
  if(ext!=='mp4'&&buffer.length>4000000)fail(400,'图片需小于 4MB');
  const filename=randomBytes(16).toString('hex')+'.'+ext,url='/media/'+filename,createdAt=new Date().toISOString();
  const cleanName=typeof name==='string'?name.replace(/[\x00-\x1f]/g,'').slice(0,180).trim():'';
  const cleanAlt=typeof alt==='string'?alt.slice(0,500).trim():'';
  await writeFile(join(dataDir,'uploads',filename),buffer);
  db.prepare('INSERT INTO media_assets VALUES(?,?,?,?)').run(url,cleanName||filename,cleanAlt,createdAt);
  return {url,name:cleanName||filename,alt:cleanAlt,kind:ext==='mp4'?'video':'image',size:buffer.length,createdAt,source:'upload'};
 }
 async function update({url,name,alt}){const asset=(await list()).find(a=>a.url===url);if(!asset)fail(404,'素材不存在');if(typeof name!=='string'||!name.trim()||name.length>180||typeof alt!=='string'||alt.length>500)fail(400,'请检查素材名称和图片说明');db.prepare('INSERT INTO media_assets VALUES(?,?,?,?) ON CONFLICT(url) DO UPDATE SET name=excluded.name,alt=excluded.alt').run(url,name.trim(),alt.trim(),asset.createdAt);return {...asset,name:name.trim(),alt:alt.trim()};}
 return {list,upload,update};
}
