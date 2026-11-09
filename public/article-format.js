import DOMPurify from './vendor/purify.es.mjs';
import {ARTICLE_TAGS,ARTICLE_ATTRIBUTES,safeArticleImage} from './article-policy.js';
// Deliberately small, escaped markup: headings, lists, emphasis and safe web links.
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function plain(text){return escape(text).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>');}
function inline(text){
 const expression=/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;let output='',last=0;
 for(const match of text.matchAll(expression)){
  output+=plain(text.slice(last,match.index));
  try{const url=new URL(match[2]);output+=['http:','https:'].includes(url.protocol)?`<a href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${plain(match[1])}</a>`:plain(match[0]);}catch{output+=plain(match[0]);}
  last=match.index+match[0].length;
 }
 return output+plain(text.slice(last));
}
if(DOMPurify.addHook)DOMPurify.addHook('afterSanitizeAttributes',node=>{
 if(node.nodeName==='IMG'){if(!safeArticleImage(node.getAttribute('src')))node.remove();else{node.setAttribute('loading','lazy');node.setAttribute('decoding','async');}}
 if(node.nodeName==='A'){if(!/^https?:\/\//i.test(node.getAttribute('href')||''))node.removeAttribute('href');node.setAttribute('target','_blank');node.setAttribute('rel','noopener noreferrer');}
});
export function renderArticleBody(value,format='text'){
 if(format==='html')return DOMPurify.sanitize?DOMPurify.sanitize(String(value||''),{ALLOWED_TAGS:ARTICLE_TAGS,ALLOWED_ATTR:ARTICLE_ATTRIBUTES,ALLOW_DATA_ATTR:false,ALLOW_ARIA_ATTR:false}):escape(value||'');
 const lines=String(value||'').replace(/\r\n?/g,'\n').split('\n');let result='',paragraph=[],list=[],listType='';
 const flushParagraph=()=>{if(paragraph.length){result+='<p>'+paragraph.map(inline).join('<br>')+'</p>';paragraph=[];}};
 const flushList=()=>{if(list.length){result+=`<${listType}>`+list.map(item=>'<li>'+inline(item)+'</li>').join('')+`</${listType}>`;list=[];listType='';}};
 for(const raw of lines){const line=raw.trim();if(!line){flushParagraph();flushList();continue;}const image=line.match(/^!\[([^\]\n]*)\]\(([^\s)]+)\)$/);if(image&&safeArticleImage(image[2])){flushParagraph();flushList();result+=`<figure><img src="${escape(image[2])}" alt="${escape(image[1])}" loading="lazy" decoding="async">${image[1]?`<figcaption>${escape(image[1])}</figcaption>`:''}</figure>`;continue;}const heading=line.match(/^(#{2,3})\s+(.+)$/);if(heading){flushParagraph();flushList();const level=heading[1].length;result+=`<h${level}>${inline(heading[2])}</h${level}>`;continue;}const bullet=line.match(/^[-*]\s+(.+)$/),numbered=line.match(/^\d+\.\s+(.+)$/);if(bullet||numbered){flushParagraph();const next=bullet?'ul':'ol';if(listType&&listType!==next)flushList();listType=next;list.push((bullet||numbered)[1]);continue;}flushList();paragraph.push(line);}
 flushParagraph();flushList();return result;
}
