const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number(n||0).toLocaleString('zh-CN');
const region=new Intl.DisplayNames(['zh-CN'],{type:'region'});
const country=code=>{try{return code?region.of(code):'未知 / 本地网络';}catch{return code||'未知';}};
const time=value=>new Date(value).toLocaleString('zh-CN',{timeZone:'Africa/Casablanca',hour12:false});
export function createAnalyticsPanel({api}){
 let root,days=7,page=1,serial=0;
 function chart(trend){
  const width=760,height=180,pad=22,max=Math.max(1,...trend.map(d=>d.views));
  const point=(d,i,key)=>[pad+i*(width-2*pad)/Math.max(1,trend.length-1),height-pad-d[key]/max*(height-2*pad)];
  const line=key=>trend.map((d,i)=>(i?'L':'M')+point(d,i,key).join(',')).join(' ');
  return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="每日浏览量与独立访客趋势"><line x1="22" y1="158" x2="738" y2="158" class="chart-axis"/><path d="${line('views')}" class="chart-views"/><path d="${line('visitors')}" class="chart-visitors"/>${trend.length===1?`<circle cx="22" cy="${point(trend[0],0,'views')[1]}" r="4" class="chart-point"/>`:''}</svg><div class="chart-dates"><span>${esc(trend[0].day)}</span><span>${esc(trend.at(-1).day)}</span></div>`;
 }
 const empty=(cols,text)=>`<tr><td colspan="${cols}" class="analytics-empty">${text}</td></tr>`;
 function markup(d){
  const labels={1:'今天',7:'近7天',30:'近30天',90:'近90天'};
  return `<div class="analytics-controls"><div><label>统计时间 <select id="analytics-range">${[1,7,30,90].map(n=>`<option value="${n}" ${days===n?'selected':''}>${labels[n]}</option>`).join('')}</select></label><span>${esc(d.from)} — ${esc(d.to)} · 摩洛哥时间</span></div><button class="secondary-button" id="analytics-refresh">刷新数据 ↻</button></div>
  <div class="analytics-today"><span class="analytics-live-dot"></span><strong>今天</strong><span><b>${number(d.today.visitors)}</b> 位独立访客</span><span><b>${number(d.today.views)}</b> 次页面浏览</span><small>开始统计：${esc(time(d.startedAt))}</small></div>
  <div class="stat-grid">${[['独立访客',d.summary.visitors,'同一浏览器在所选时段去重'],['页面浏览次数',d.summary.views,'打开页面及站内跳转均计入'],['文章浏览次数',d.summary.articleViews,'同一文章的所有语言合并'],['来源国家 / 地区',d.summary.countries,'IP归属地估算']].map(([label,value,hint])=>`<div class="stat-card"><span>${label}</span><strong>${number(value)}</strong><small>${hint}</small></div>`).join('')}</div>
  <section class="panel"><div class="panel-heading"><h2>访问趋势</h2><div class="analytics-legend"><span>● 浏览次数</span><span>● 独立访客</span></div></div><div class="analytics-chart-wrap">${chart(d.trend)}</div><details class="analytics-daily"><summary>查看每日明细</summary><div class="table-scroll"><table><thead><tr><th>日期</th><th>浏览次数</th><th>独立访客</th></tr></thead><tbody>${d.trend.map(r=>`<tr><td>${esc(r.day)}</td><td>${number(r.views)}</td><td>${number(r.visitors)}</td></tr>`).join('')}</tbody></table></div></details></section>
  <div class="analytics-split"><section class="panel"><div class="panel-heading"><h2>访客来自哪里</h2></div><div class="table-scroll"><table><thead><tr><th>国家 / 地区</th><th>浏览次数</th><th>独立访客</th></tr></thead><tbody>${d.countries.map(c=>`<tr><td>${esc(country(c.country))}</td><td>${number(c.views)}</td><td>${number(c.visitors)}</td></tr>`).join('')||empty(3,'有访客后将在这里显示来源分布')}</tbody></table></div></section><section class="panel"><div class="panel-heading"><h2>访问来源网站</h2></div><div class="table-scroll"><table><thead><tr><th>来源</th><th>浏览次数</th></tr></thead><tbody>${d.sources.map(s=>`<tr><td>${esc(s.referrer||'直接访问 / 站内浏览')}</td><td>${number(s.views)}</td></tr>`).join('')||empty(2,'暂无来源数据')}</tbody></table></div></section></div>
  <section class="panel"><div class="panel-heading"><h2>文章阅读排行</h2><span class="field-hint">${labels[days]} · 各语言合并</span></div><div class="table-scroll"><table><thead><tr><th>文章</th><th>浏览次数</th><th>独立读者</th><th>状态</th></tr></thead><tbody>${d.articles.map(a=>`<tr><td><strong>${esc(a.title)}</strong><small>${esc(a.slug)}</small></td><td><strong>${number(a.views)}</strong></td><td>${number(a.visitors)}</td><td>${a.status==='published'?'已发布':a.status==='draft'?'草稿':'已删除'}</td></tr>`).join('')||empty(4,'发布文章后即可查看阅读数据')}</tbody></table></div></section>
  <section class="panel"><div class="panel-heading"><h2>最近访问记录</h2><span class="field-hint">共 ${number(d.pagination.total)} 条</span></div><div class="table-scroll"><table class="analytics-records"><thead><tr><th>时间（摩洛哥）</th><th>访问页面</th><th>IP地址</th><th>国家 / 地区</th><th>设备</th><th>来源</th></tr></thead><tbody>${d.recent.map(v=>`<tr><td>${esc(time(v.createdAt))}</td><td><span class="analytics-path">${esc(v.path)}</span></td><td><code dir="ltr">${esc(v.ip||'未知')}</code></td><td>${esc(country(v.country))}</td><td>${v.device==='mobile'?'手机 / 平板':'电脑'}</td><td>${esc(v.referrer||'直接 / 站内')}</td></tr>`).join('')||empty(6,'尚无访问记录。正式访客打开官网后，数据会从这里开始累计。')}</tbody></table></div><div class="analytics-pagination"><button class="secondary-button" id="analytics-prev" ${d.pagination.page<=1?'disabled':''}>上一页</button><span>${d.pagination.page} / ${d.pagination.pageCount}</span><button class="secondary-button" id="analytics-next" ${d.pagination.page>=d.pagination.pageCount?'disabled':''}>下一页</button></div></section>
  <div class="admin-note"><strong>统计说明</strong><p>数据从功能启用后开始累计，保留最近90天。独立访客以浏览器标识估算，同一个人使用多台设备可能计为多位。排除后台、编辑预览、已登录管理员及可识别的自动访问；浏览器屏蔽统计时不会记录。IP只能估算国家或地区，无法确定精确地址。</p><p>IP归属地数据：<a href="https://db-ip.com" target="_blank" rel="noopener noreferrer">DB-IP</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>。仅授权管理员可查看访问明细。</p></div>`;
 }
 async function refresh(){
  const token=++serial,container=root;
  container.innerHTML='<div class="panel analytics-loading" role="status">正在读取访问统计…</div>';
  try{const d=await api(`analytics?days=${days}&page=${page}`);if(token!==serial||!container.isConnected)return;page=d.pagination.page;container.innerHTML=markup(d);
   container.querySelector('#analytics-range').onchange=e=>{days=Number(e.target.value);page=1;refresh();};
   container.querySelector('#analytics-refresh').onclick=refresh;
   container.querySelector('#analytics-prev').onclick=()=>{page--;refresh();};
   container.querySelector('#analytics-next').onclick=()=>{page++;refresh();};
  }catch(e){if(token!==serial||!container.isConnected)return;container.innerHTML=`<div class="panel analytics-loading"><p role="alert">${esc(e.message)}</p><button class="secondary-button" id="analytics-retry">重新加载</button></div>`;container.querySelector('#analytics-retry').onclick=refresh;}
 }
 return {mount(element){root=element;page=1;refresh();}};
}
