import {whatsappButton,analyticsPrivacy} from '../public/site-extras.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {settings} from '../seed.mjs';
import {LANGUAGES,LANGUAGE_LABELS,getPublicLanguages,getDefaultLanguage} from '../public/languages.js';
import {SERVICE_CATALOG} from '../public/services.js';
import {routeMapMarkup} from '../public/assets/freight-map.js';

// Exercise the actual page renderer without launching or controlling a browser.
const source=(await readFile(new URL('../public/app.js',import.meta.url),'utf8')).replace(/^import .+;\n/gm,'').split("document.addEventListener('click'")[0];
function render(path,enabled){
 const output={innerHTML:''},control={},fixture={settings:{...structuredClone(settings),enabledLanguages:enabled,defaultLanguage:'fr'},articles:[]};
 const location={pathname:path,search:'?ref=language-test',hash:''},history=[];
 const context={whatsappButton,analyticsPrivacy,trackPage:()=>{},SERVICE_CATALOG,LANGUAGES,LANGUAGE_LABELS,getPublicLanguages,getDefaultLanguage,routeMapMarkup,fixture,location,localStorage:{getItem:()=> 'zh',setItem(){}},history:{replaceState:(_state,_title,url)=>history.push(url)},document:{documentElement:{},querySelector:selector=>selector==='#app'?output:['.skip','#language','#menu'].includes(selector)?control:null,querySelectorAll:()=>[]},window:{},URL,URLSearchParams,FormData};
 vm.runInNewContext(source+'\nsite=fixture;render();',context);
 const select=output.innerHTML.match(/<select aria-label="Language"[^>]*>([\s\S]*?)<\/select>/)[1];
 return {html:output.innerHTML,options:[...select.matchAll(/<option value="([^"]+)"/g)].map(match=>match[1]),lang:context.document.documentElement.lang,history};
}

test('public page hides disabled languages and replaces a stale Chinese route with the enabled default',()=>{
 const result=render('/zh/about',['fr','ary']);
 assert.deepEqual(result.options,['fr','ary']);assert.equal(result.lang,'fr');assert.deepEqual(result.history,['/fr/about?ref=language-test']);
 assert.ok(!result.html.includes(' / 中文'));assert.ok(result.html.includes('Notre mission'));
});
test('authenticated visual preview keeps Chinese and all editing language options while Chinese is hidden publicly',()=>{
 const result=render('/admin/preview/zh/about',['fr','ary']);
 assert.deepEqual(result.options,['en','fr','ary','zh']);assert.equal(result.lang,'zh-CN');assert.ok(result.html.includes('企业使命'));assert.ok(result.html.includes('data-cms-key="companyMissionText"'));assert.deepEqual(result.history,[]);
});

test('contact page language summary follows public switches while Chinese remains available in the editor',()=>{
 const result=render('/fr/contact',['fr','ary']);
 const summary=result.html.match(/class="contact-languages">([^<]*)</)[1];
 assert.equal(summary,'Français · الدارجة');
 const preview=render('/admin/preview/zh/contact',['fr','ary']);
 assert.ok(preview.html.match(/class="contact-languages">([^<]*)</)[1].includes('中文'));
});
