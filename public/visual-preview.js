// This bridge runs only inside an authenticated /admin/preview/... document.
const CHANNEL='barsan-visual-editor';
const normalize=value=>String(value||'').replace(/\s+/g,' ').trim();
export function installPreview({getSite,setSite,getRoute}) {
 let mode='edit',selection=null,lastRoute='';
 const send=(type,payload={})=>{if(parent!==window)parent.postMessage({channel:CHANNEL,type,...payload},location.origin);};
 const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href='/visual-preview.css';document.head.append(stylesheet);
 function matches(element,s){if(!s)return false;if(s.kind==='text')return element.dataset.cmsKey===s.key;if(s.kind==='setting')return element.dataset.cmsSetting===s.key;if(s.kind==='video')return element.dataset.cmsVideo===s.key;if(s.kind==='image')return element.dataset.cmsImage===s.key;return element.dataset.cmsArticle===s.id&&element.dataset.cmsField===s.field;}
 function decorate(){
  const site=getSite(),{lang,page,slug}=getRoute();
  const registry=new Map();
  for(const [key,value]of Object.entries(site.settings.ui[lang]))if(normalize(value)&&!registry.has(normalize(value)))registry.set(normalize(value),{cmsKey:key});
  for(const key of ['company','email','phone','address'])if(site.settings[key])registry.set(normalize(site.settings[key]),{cmsSetting:key});
  const walker=document.createTreeWalker(document.querySelector('#app'),NodeFilter.SHOW_TEXT);const nodes=[];let node;while(node=walker.nextNode())nodes.push(node);
  for(const text of nodes){const p=text.parentElement;if(!p||p.closest('[data-cms-key],[data-cms-setting],[data-cms-field],script,style,option,select'))continue;const fields=registry.get(normalize(text.nodeValue));if(!fields)continue;const span=document.createElement('span');Object.assign(span.dataset,fields);text.replaceWith(span);span.append(text);}
  for(const element of document.querySelectorAll('input[placeholder],textarea[placeholder]')){const field=registry.get(normalize(element.getAttribute('placeholder')));if(field?.cmsKey)element.dataset.cmsKey=field.cmsKey;}
  for(const element of document.querySelectorAll('.freight-map text,.freight-map-legend span')){const value=registry.get(normalize(element.textContent));if(value?.cmsKey)element.dataset.cmsKey=value.cmsKey;}
  for(const element of document.querySelectorAll('[data-cms-key],[data-cms-setting],[data-cms-image],[data-cms-video],[data-cms-field]')){element.classList.add('cms-editable');element.classList.toggle('cms-selected',matches(element,selection));if(!element.matches('a,button,input,select,textarea'))element.tabIndex=0;}
  document.body.classList.toggle('cms-edit-mode',mode==='edit');
  const route=lang+'/'+page+(slug?'/'+slug:'');if(route!==lastRoute){lastRoute=route;send('route',{lang,page:page+(slug?'/'+slug:'')});}
 }
 function choose(element){
  let item=element.closest('[data-cms-key],[data-cms-setting],[data-cms-image],[data-cms-video],[data-cms-field]');
  if(!item&&element.matches('h1,h2,h3,h4,p,label,button,a,li,strong,em'))item=element.querySelector('[data-cms-key],[data-cms-setting],[data-cms-field]');
  if(!item){const image=element.closest('.service-card-photo,.hero-image,.about-photo,.brand')?.querySelector('[data-cms-video],[data-cms-image]');if(image)item=image;}
  if(!item)return false;
  const {lang}=getRoute();
  if(item.dataset.cmsField){selection={kind:'article',id:item.dataset.cmsArticle,field:item.dataset.cmsField,lang};}
  else if(item.dataset.cmsVideo){selection={kind:'video',key:item.dataset.cmsVideo,lang};}
  else if(item.dataset.cmsImage){selection={kind:'image',key:item.dataset.cmsImage,lang};}
  else if(item.dataset.cmsSetting){selection={kind:'setting',key:item.dataset.cmsSetting,lang};}
  else selection={kind:'text',key:item.dataset.cmsKey,lang};
  decorate();send('select',{selection});return true;
 }
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:event.target.parentElement;
  if(mode==='edit'&&!target.closest('#language,#menu,#hero-video-toggle')){event.preventDefault();event.stopImmediatePropagation();if(!choose(target))send('hint',{text:'点击文字或照片即可修改。切换页面可使用顶部页面菜单。'});return;}
  const anchor=target.closest('a');if(anchor){const url=new URL(anchor.href);if(url.origin!==location.origin||!/^\/(en|fr|ary|zh)(\/|$)/.test(url.pathname)){event.preventDefault();event.stopImmediatePropagation();send('hint',{text:'预览中不会打开外部联系方式。'});}}
 },true);
 document.addEventListener('keydown',event=>{if(mode==='edit'&&['Enter',' '].includes(event.key)&&event.target.matches('.cms-editable')&&!event.target.matches('input,textarea,select')){event.preventDefault();event.stopImmediatePropagation();choose(event.target);}},true);
 document.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();send('hint',{text:'编辑预览不提交客户询价。'});},true);
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent||event.data?.channel!==CHANNEL)return;
  const message=event.data;
  if(message.type==='state'){
   mode=message.mode||mode;selection=message.selection||null;
   const x=scrollX,y=scrollY;setSite({settings:message.settings,articles:message.articles});window.scrollTo(x,y);
  }else if(message.type==='mode'){mode=message.mode;decorate();}
  else if(message.type==='jump'){
   const selectors={top:'.hero,.page-heading,.article-section',services:'.section.services,.services-grid',about:'.company-values,.about-strip,.about-grid',process:'.process',news:'.news-grid',contact:'.contact-grid',footer:'.cta,footer'};
   document.querySelector(selectors[message.section]||'.hero')?.scrollIntoView({block:'start',behavior:'smooth'});
  }
 });
 queueMicrotask(()=>send('ready'));
 return {afterRender:decorate};
}
