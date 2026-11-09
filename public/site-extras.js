const labels={en:'Chat on WhatsApp',fr:'Discuter sur WhatsApp',ary:'هضر معانا فواتساب',zh:'通过 WhatsApp 联系我们'};
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function whatsappButton(number,lang,preview=false){
 const digits=String(number||'').replace(/\D/g,'');
 if(preview||!/^\d{7,16}$/.test(digits))return '';
 return `<a class="whatsapp-float" href="https://wa.me/${digits}" target="_blank" rel="noopener noreferrer" aria-label="${escape(labels[lang]||labels.en)}" title="${escape(labels[lang]||labels.en)}"><svg viewBox="0 0 32 32" width="31" height="31" aria-hidden="true" fill="currentColor"><path d="M16 .9A15 15 0 0 0 3.1 23.5L1 31l7.7-2A15.1 15.1 0 1 0 16 .9Zm0 27.5a12.4 12.4 0 0 1-6.3-1.7l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.5 12.5 0 1 1 16 28.4Zm6.9-9.3c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.8-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.5 1.5 3.8c.2.3 2.6 4 6.3 5.6l2.1.8c.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z"/></svg><span>WhatsApp</span></a>`;
}
export const analyticsPrivacy={
 en:'We use first-party visit statistics to understand page and article readership. A random browser identifier is stored for up to 90 days. IP addresses, approximate country or region, page, visit time and referring domain are retained for 90 days and visible only to authorized administrators. IP addresses are looked up locally and are not sent to a third-party analytics service. Location is approximate.',
 fr:'Nous utilisons des statistiques internes de consultation des pages et articles. Un identifiant aléatoire du navigateur est conservé pendant 90 jours maximum. Adresse IP, pays ou région approximatifs, page, heure et domaine référent sont conservés 90 jours et accessibles uniquement aux administrateurs autorisés. La localisation IP est effectuée sur notre serveur, sans service d’analyse tiers. Elle reste approximative.',
 ary:'كنستعملو إحصائيات داخلية باش نفهمو زيارات الصفحات والمقالات. كيتخزن معرّف عشوائي فالمتصفح حتى لـ90 يوم. عنوان IP والبلد أو المنطقة التقريبية والصفحة ووقت الزيارة وموقع الإحالة كيبقاو 90 يوم، وكيشوفهم غير المسؤولين المسموح ليهم. تحديد بلد IP كيدار محلياً فالسيرفر بلا ما نرسلوه لخدمة إحصائيات خارجية. الموقع تقريبي.',
 zh:'本站使用自有访问统计了解页面及文章阅读情况，随机浏览器标识最多保存90天。访问IP、估算国家或地区、页面、访问时间与来源域名保留90天，仅授权管理员可查看。IP归属地由本服务器离线查询，不发送给第三方统计服务；归属地仅为估算。'
};
let visitorId='',lastPath='',pendingPath='';
function identity(){
 if(visitorId)return visitorId;
 try{const item=JSON.parse(localStorage.getItem('barsan-visitor')||'null');if(item&&item.expires>Date.now()&&/^[a-f\d-]{36}$/i.test(item.id))visitorId=item.id;}catch{}
 if(!visitorId){visitorId=crypto.randomUUID();try{localStorage.setItem('barsan-visitor',JSON.stringify({id:visitorId,expires:Date.now()+90*86400000}));}catch{}}
 return visitorId;
}
function send(){
 if(!pendingPath||document.visibilityState!=='visible'||pendingPath===lastPath)return;
 lastPath=pendingPath;
 try{fetch('/api/site/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId:crypto.randomUUID(),visitorId:identity(),path:lastPath,referrer:document.referrer}),keepalive:true}).catch(()=>{});}catch{}
}
export function trackPage(path,{preview=false,valid=true}={}){if(preview||!valid)return;pendingPath=path;send();}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',send);
