import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import oceanCampaign from '../content/marketing/2026-11-ocean/articles.mjs';

const project=fileURLToPath(new URL('../',import.meta.url));
const ocean=process.argv[3]==='ocean';
if (process.argv[3] && !ocean) throw Error('Unknown campaign: '+process.argv[3]);
const campaignDir=join(project,'content/marketing',ocean?'2026-11-ocean':'2026-11');
const campaign=ocean?oceanCampaign:JSON.parse(await readFile(join(campaignDir,'articles.json'),'utf8'));
const output=resolve(process.argv[2]||join(project,`../barsan-articles-${campaign.preparedAt}`));
const category=ocean?'海运资讯':'实用指南';
const collection=ocean?'中国到摩洛哥 · 五篇海运咨询指南':'给摩洛哥客户的五篇实用指南';
const preparedDate=new Intl.DateTimeFormat('zh-CN',{dateStyle:'long',timeZone:'UTC'}).format(new Date(campaign.preparedAt));
const languages={zh:'中文审阅版',fr:'Français',ary:'الدارجة المغربية',en:'English'};
const escape=value=>String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const style=`
 :root{color-scheme:light;font-family:Arial,"Microsoft YaHei",sans-serif;color:#242135;background:#f7f6fa}
 *{box-sizing:border-box}body{margin:0}main{max-width:920px;margin:36px auto;padding:42px 48px;background:white;border:1px solid #e6e0ef;border-radius:16px}
 h1{font-size:clamp(27px,4vw,42px);line-height:1.3;margin:0 0 20px;color:#29213d}h2{font-size:24px;line-height:1.45;margin:36px 0 14px;color:#5c3998}h3{line-height:1.5}p,li{font-size:16px;line-height:1.9}p{margin:15px 0}li+li{margin-top:7px}a{color:#5c3998;overflow-wrap:anywhere}
 figure{margin:28px 0}figure img{display:block;width:100%;max-height:350px;object-fit:cover;border-radius:10px}figcaption{font-size:12px;color:#7d738b;margin-top:8px}
 table{width:100%;border-collapse:collapse;font-size:14px;margin:22px 0;line-height:1.7}th,td{padding:14px 16px;border:1px solid #e7e0f0;text-align:start;vertical-align:top;overflow-wrap:anywhere}th{background:#efe9f8;color:#4d2e7f}th:first-child{min-width:90px}
 blockquote{margin:26px 0;padding:7px 22px;background:#f3eef9;border-inline-start:4px solid #7651b3;border-radius:5px}blockquote p{font-size:15px}hr{margin:32px 0;border:0;border-top:1px solid #e7e0f0}.brand{font-size:12px;letter-spacing:2px;color:#7651b3;margin-bottom:20px}.intro{font-size:18px;color:#786b8a}.actions{display:flex;flex-wrap:wrap;gap:12px}.actions a{background:#5c3998;color:white;text-decoration:none;border-radius:6px;padding:12px 18px;font-weight:bold}.actions a+ a{background:#eaf5ed;color:#176b3d}.share-box{padding:14px 18px;border:1px solid #e2d9ed;border-radius:8px}.share-box small{color:#7d738b}.cover-grid{display:grid;gap:22px}.preview-card{padding:20px;border:1px solid #e7e0f0;border-radius:10px}.preview-card h2{margin:10px 0;font-size:22px}.preview-card img{width:100%;height:170px;object-fit:cover;border-radius:8px}.language-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.language-links a{padding:8px 12px;border:1px solid #d9cce9;border-radius:5px;text-decoration:none;font-size:14px}.preview-card p{font-size:14px}.preview-card .order{color:#7651b3;font-weight:bold;font-size:12px;letter-spacing:1px}.muted{color:#786b8a;font-size:14px}
 @media(max-width:650px){main{margin:0;padding:28px 20px;border:0;border-radius:0}h2{font-size:21px}th,td{padding:10px 8px;font-size:12px}table{display:block;overflow-x:auto}p,li{font-size:15px}.actions a{font-size:14px}}
`;

await mkdir(output,{recursive:true});
const imageCache=new Map();
async function embeddedImage(path){
 if(!imageCache.has(path)){
  if(!/^\/assets\/(port|hero-ship-poster|service-(sea|air|customs|warehouse|ddp))\.jpg$/.test(path)&&!/^\/assets\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*\.jpg$/.test(path))throw Error('Unexpected campaign image');
  const bytes=await readFile(join(project,'public',path));
  imageCache.set(path,'data:image/jpeg;base64,'+bytes.toString('base64'));
 }
 return imageCache.get(path);
}

function contactBlock(language){
 const copy={
  zh:{title:'把你的货物资料发给 Barsan',quote:'咨询运输方案',whatsapp:'通过 WhatsApp 联系'},
  fr:{title:'Parlez de votre expédition à Barsan',quote:'Demander une étude de transport',whatsapp:'Contacter sur WhatsApp'},
  ary:{title:'صيفط معلومات السلعة ديالك لـ Barsan',quote:'سول على حل مناسب للشحن',whatsapp:'تواصل معانا فواتساب'},
  en:{title:'Tell Barsan about your shipment',quote:'Discuss your shipping plan',whatsapp:'Contact on WhatsApp'}
 }[language];
 const publicLanguage=language==='zh'?'fr':language;
 return `<hr><h2>${escape(copy.title)}</h2><p><a href="https://ma.barsan.com.cn/${publicLanguage}/quote">${escape(copy.quote)}</a> · <a href="https://wa.me/8615120047575">${escape(copy.whatsapp)}</a></p><p>Barsan International Freight Forwarding</p>`;
}

for(const language of campaign.languages){
 await mkdir(join(output,language),{recursive:true});
 for(const article of campaign.articles){
  const body=article.body[language].replaceAll(article.cover,await embeddedImage(article.cover));
  const content=`<!doctype html>
<html lang="${language==='zh'?'zh-CN':language==='ary'?'ary-MA':language}" dir="${language==='ary'?'rtl':'ltr'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(article.excerpt[language])}"><title>${escape(article.title[language])} | Barsan</title><style>${style}</style></head>
<body><main><h1>${escape(article.title[language])}</h1><p>${escape(article.excerpt[language])}</p>
${body}
${contactBlock(language)}</main></body></html>
`;
  await writeFile(join(output,language,article.slug+'.html'),content);
 }
}

await mkdir(join(output,'封面图片'),{recursive:true});
for(const article of campaign.articles){
 const image=await readFile(join(project,'public',article.cover));
 await writeFile(join(output,'封面图片',article.slug+'.jpg'),image);
}
const coverSources=JSON.parse(await readFile(join(campaignDir,'cover-sources.json'),'utf8'));
await writeFile(join(output,'封面来源.txt'),[
 `Barsan 五篇文章实拍封面 · ${coverSources.updatedAt}`,
 '照片裁为横版，用于说明文章涉及的场景。',
 ...coverSources.covers.map(cover=>[
  campaign.articles.find(article=>article.slug===cover.slug).title.zh,
  `文件　封面图片/${cover.slug}.jpg`,
  `摄影　${cover.photographer} / ${cover.platform}`,
  `原图　${cover.url}`,
  `许可　${coverSources.licenses[cover.platform]}`
 ].join('\n'))
].join('\n\n')+'\n');

const cards=[];
for(const [index,article]of campaign.articles.entries()){
 cards.push(`<section class="preview-card"><span class="order">ARTICLE ${String(index+1).padStart(2,'0')} · ${escape(category)}</span><figure><img src="封面图片/${article.slug}.jpg" alt="${escape(article.title.zh)}" style="height:auto;aspect-ratio:16/9"></figure><h2>${escape(article.title.zh)}</h2><p>${escape(article.excerpt.zh)}</p><div class="language-links">${Object.entries(languages).map(([language,label])=>`<a href="${language}/${article.slug}.html" ${language==='ary'?'dir="rtl"':''}>${label} ↗</a>`).join('')}</div><div class="share-box"><small>法语转发短文</small><p>${escape(article.share.fr)}</p><small>Darija 转发短文</small><p dir="rtl">${escape(article.share.ary)}</p><small>中文核对</small><p>${escape(article.share.zh)}</p></div></section>`);
}
const index=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(collection)} | Barsan</title><style>${style}</style></head><body><main><div class="brand">BARSAN · CONTENT COLLECTION</div><h1>${escape(collection)}</h1><p class="intro">中文审阅、法语、Darija 与英语共20个文章文件。点击对应语言即可预览。</p><p class="muted">配图已内嵌，解压后可直接打开。预览样式用于阅读，导入后台后按官网主题显示。每篇下方提供可复制的转发短文，发布后配上对应文章链接。</p><h2>后台发布步骤</h2><ol><li>进入正式后台的「新闻与软文」，点击「新建文章」，选择中文或法语作为编辑语言。</li><li>点击「导入 HTML」，从对应语言文件夹中选择一篇文章。标题、摘要与图片会自动导入，图片会进入素材库。</li><li>网址填写文件名去掉 .html 的部分，分类选择「${escape(category)}」。在素材库选择同篇正文图片作为封面。</li><li>先保存草稿检查，再按计划设置日期并发布。后台会使用你配置的千问同步其他语言，请留意最终页面中的术语与排版。</li><li>发布后复制文章链接，搭配下方相应语言短文转发给客户。</li></ol><p class="muted">准备日期为${escape(preparedDate)}。你可以自行选择发布日期和发布顺序。</p><div class="cover-grid">${cards.join('\n')}</div></main></body></html>`;
await writeFile(join(output,'先看这里.html'),index);

const sharing=[];
for(const [index,article]of campaign.articles.entries()){
 sharing.push(`${index+1}. ${article.title.zh}\n网址标识 ${article.slug}\n`);
 for(const [language,label]of Object.entries(languages))sharing.push(`${label}\n${article.share[language]}\n`);
 sharing.push('发布后在短文后附上对应的正式文章链接。\n\n');
}
await writeFile(join(output,'转发短文.txt'),sharing.join('\n'));
await writeFile(join(output,'发布说明.txt'),`Barsan · ${collection}\n\n先打开“先看这里.html”查看五篇文章与转发短文。\n\nzh 为中文审阅稿，fr 为法语稿，ary 为摩洛哥Darija稿，en 为英语稿。每个文件均有完整标题、摘要、正文和内嵌图片。\n\n后台入口 https://ma.barsan.com.cn/admin\n选择“新闻与软文” → “新建文章” → 选择编辑语言 → “导入HTML”。\n导入单个HTML文件后，网址填写文件名去掉.html的部分，分类选“${category}”。从素材库选对应图片作为封面，或上传“封面图片”文件夹中的同名图片，检查草稿后再发布。\n后台按现有千问配置同步其他语言。四语成稿方便提前审阅，实际保存后的译文以后台结果为准。\n\n所有配图均为场景示意。客户案例和市场价格未用于这些文章。准备日期 ${campaign.preparedAt}，发布日期由你设置。\n`);
console.log(`Exported ${campaign.articles.length} articles in ${campaign.languages.length} languages to ${output}`);
