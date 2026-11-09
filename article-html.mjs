import sanitize from 'sanitize-html';
import {ARTICLE_TAGS,safeArticleImage} from './public/article-policy.js';
const attributes={img:['src','alt','loading','decoding'],a:['href','title','target','rel'],td:['colspan','rowspan'],th:['colspan','rowspan','scope'],'*':['dir']};
export function cleanArticleHtml(html,{images={},missing=[]}={}){
 return sanitize(String(html),{allowedTags:ARTICLE_TAGS,allowedAttributes:attributes,allowedSchemes:['https','http'],allowProtocolRelative:false,nonTextTags:['script','style','textarea','option','iframe','object','template','head'],transformTags:{
  h1:'h2',img(tag,attrs){const original=attrs.src||'',src=images[original]||original;if(!safeArticleImage(src)){missing.push(original||'(无图片地址)');return {tagName:'p',attribs:{},text:'【待补充图片：'+(original.slice(0,160)||'未命名图片')+'】'};}return {tagName:'img',attribs:{src,alt:attrs.alt||'',loading:'lazy',decoding:'async'}};},
  a(tag,attrs){return {tagName:'a',attribs:{href:attrs.href||'',title:attrs.title||'',target:'_blank',rel:'noopener noreferrer'}};}
 }}).trim();
}
function plain(value){return sanitize(value,{allowedTags:[],allowedAttributes:{}}).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
export async function importArticleHtml(html,{imageMap={},upload}={}){
 const sources=[];sanitize(html,{allowedTags:[],transformTags:{img(tag,attrs){if(attrs.src)sources.push({src:attrs.src,alt:attrs.alt||''});return {tagName:'span',attribs:{}};}}});
 const images={};let embedded=0;
 for(const {src,alt}of sources){
  if(safeArticleImage(src))continue;
  if(safeArticleImage(imageMap[src])){images[src]=imageMap[src];continue;}
  let base='';try{base=decodeURIComponent(src.split(/[?#]/)[0]).replaceAll('\\','/').split('/').pop();}catch{}
  if(!/^[a-z][a-z0-9+.-]*:/i.test(src)&&safeArticleImage(imageMap[base])){images[src]=imageMap[base];continue;}
  const data=/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/\s]+=*)$/i.exec(src);
  if(data&&upload){const asset=await upload({data:data[2].replace(/\s/g,''),name:'HTML 图片 '+(++embedded),alt,imagesOnly:true});images[src]=asset.url;}
 }
 const content=html.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1]||html;
 const heading=content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i);
 const title=plain(heading?.[1]||html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]||'').slice(0,250);
 const missing=[];const body=cleanArticleHtml(heading?content.replace(heading[0],''):content,{images,missing});
 if(body.length>60000)throw Object.assign(Error('导入后的正文超过 60,000 字符，请拆分文章后导入'),{status:400});
 const excerpt=plain(content.match(/<p\b[^>]*>([\s\S]*?)<\/p\s*>/i)?.[1]||body).slice(0,220);
 return {title,excerpt,body,bodyFormat:'html',missingImages:[...new Set(missing)],embeddedImages:embedded};
}
