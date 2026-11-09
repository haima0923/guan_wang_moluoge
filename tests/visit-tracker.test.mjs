import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import vm from 'node:vm';
const source=(await readFile(new URL('../public/site-extras.js',import.meta.url),'utf8')).replace(/^export /gm,'');
function fixture(visible=true){
 const calls=[],listeners={};
 const document={visibilityState:visible?'visible':'hidden',referrer:'https://search.example/',addEventListener:(name,fn)=>listeners[name]=fn};
 const context=vm.createContext({document,crypto:{randomUUID},localStorage:{getItem:()=>null,setItem(){}},fetch:(path,options)=>{calls.push({path,...options,data:JSON.parse(options.body)});return Promise.resolve();}});
 vm.runInContext(source,context);return {calls,document,listeners,run:code=>vm.runInContext(code,context)};
}
test('client records page changes once and retains one visitor across languages without counting content refreshes',()=>{
 const f=fixture();f.run("trackPage('/en'); trackPage('/en'); trackPage('/en/news/guide'); trackPage('/fr/news/guide'); trackPage('/en/news/guide');");
 assert.equal(f.calls.length,4);assert.equal(new Set(f.calls.map(c=>c.data.visitorId)).size,1);assert.equal(new Set(f.calls.map(c=>c.data.eventId)).size,4);
 assert.ok(f.calls.every(c=>c.path==='/api/site/visit'&&c.method==='POST'&&c.keepalive));
 f.run("trackPage('/zh',{preview:true});trackPage('/en/missing',{valid:false});");assert.equal(f.calls.length,4);
});
test('hidden pages wait until visible; browser storage failures do not break navigation',()=>{
 const f=fixture(false);f.run("trackPage('/en');trackPage('/fr');");assert.equal(f.calls.length,0);
 f.document.visibilityState='visible';f.listeners.visibilitychange();assert.equal(f.calls.length,1);assert.equal(f.calls[0].data.path,'/fr');
 f.listeners.visibilitychange();assert.equal(f.calls.length,1);
 f.run("localStorage.getItem=()=>{throw Error('disabled')};localStorage.setItem=()=>{throw Error('disabled')};visitorId='';trackPage('/en/about');");assert.equal(f.calls.length,2);
});
