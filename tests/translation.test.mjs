import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {mkdtemp, rm, readFile, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
test('Qwen configuration, automatic language sync and atomic publication', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'barsan-translation-'));
  const port = 16000 + Math.floor(Math.random() * 1000);
  const base = 'http://127.0.0.1:' + port;
  const apiKey = 'fixture-qwen-key-private';
  let cookie = '', mode = 'ok', calls = 0, release, reached;
  const upstream = http.createServer(async (req, res) => {
    const chunks = [];for await (const chunk of req) chunks.push(chunk);
    const input = JSON.parse(Buffer.concat(chunks));
    assert.equal(req.url, '/compatible-mode/v1/chat/completions');
    assert.equal(req.headers.authorization, 'Bearer ' + apiKey);
    assert.equal(input.enable_thinking, false);
    assert.equal(input.response_format.type, 'json_object');
    assert.match(input.messages[0].content, /Moroccan Darija/);
    const content = JSON.parse(input.messages.at(-1).content);calls++;
    if (mode === 'wait') { reached?.();await new Promise(resolve => release = resolve); }
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'unauthorized') { res.writeHead(401);res.end(JSON.stringify({error:apiKey}));return; }
    const translations = Object.fromEntries(Object.keys(content.targetLanguages).map(l => [l, '[' + l + '] ' + content.text]));
    if (content.text.includes('BROKEN_RESPONSE')) delete translations.fr;
    if (content.text.includes('BROKEN_MARKUP')) for (const l of Object.keys(translations)) translations[l] = 'missing formatting';
    res.end(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({translations})}}]}));
  });
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
  const endpoint = 'http://127.0.0.1:' + upstream.address().port + '/compatible-mode/v1';
  const child = spawn(process.execPath, ['server.mjs'], {cwd:root,env:{...process.env,PORT:String(port),HOST:'127.0.0.1',DATA_DIR:dir,NODE_ENV:'production',ADMIN_PASSWORD:'Fixture-translation-admin-2026',DASHSCOPE_API_KEY:'',QWEN_BASE_URL:'',QWEN_MODEL:'',TRANSLATION_ALLOW_LOCAL:'1'},stdio:['ignore','pipe','pipe']});
  async function req(path, method = 'GET', body) {
    const response = await fetch(base + '/api/admin/' + path, {method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
    const parsed=await response.json();return {status:response.status, body:parsed, headers:response.headers};
  }
  try {
    await new Promise((resolve,reject) => {const timer=setTimeout(()=>reject(Error('Startup timed out')),7000);child.stdout.on('data',data=>{if(String(data).includes('Barsan local server')){clearTimeout(timer);resolve();}});child.once('exit',()=>reject(Error('Startup failed')));});
    assert.equal((await req('translation')).status,401);
    const login = await req('login','POST',{username:'admin',password:'Fixture-translation-admin-2026'});
    cookie = login.headers.get('set-cookie').split(';')[0];
    let draft;
    await t.test('unconfigured service accepts a single-language draft and blocks incomplete publication',async()=>{
      const input={slug:'qwen-single-language',category:'guide',date:'2026-01-01',status:'draft',title:{zh:'摩洛哥海运指南'},excerpt:{zh:'提前规划运输与清关'},body:{zh:'<p>从中国发往摩洛哥。</p><figure><img src="/assets/service-sea.jpg" alt="货轮"><figcaption>海运配图</figcaption></figure><table><tr><td>广州</td></tr></table>'},bodyFormat:{zh:'html'},syncTranslations:true,sourceLanguage:'zh'};
      const result=await req('articles','POST',input);assert.equal(result.status,201);assert.equal(result.body.translationPending,true);assert.equal(result.body.title.en,'');draft=result.body;
      const rejected=await req('articles/'+draft.id,'PUT',{...draft,status:'published',syncTranslations:true,sourceLanguage:'zh'});assert.equal(rejected.status,503);assert.equal((await req('data')).body.articles.find(a=>a.id===draft.id).status,'draft');
    });
    await t.test('Qwen credentials are private and reusable without returning the key',async()=>{
      assert.equal((await req('translation','PUT',{baseUrl:'http://example.com/v1',model:'qwen-plus',apiKey})).status,400);
      const saved=await req('translation','PUT',{baseUrl:endpoint,model:'qwen-plus',apiKey});assert.equal(saved.status,200);assert.equal(saved.body.configured,true);assert.ok(!JSON.stringify(saved.body).includes(apiKey));assert.ok(!JSON.stringify((await req('data')).body).includes(apiKey));
      assert.equal((await stat(join(dir,'translation-config.json'))).mode & 0o777,0o600);assert.equal(JSON.parse(await readFile(join(dir,'translation-config.json'),'utf8')).apiKey,apiKey);
      assert.equal((await req('translation','PUT',{baseUrl:endpoint,model:'qwen-plus',apiKey:''})).status,200);
      assert.equal((await req('translation/test','POST',{})).status,200);
    });
    await t.test('one-language article publication translates all fields and keeps HTML images and tables',async()=>{
      const versions=(await req('data')).body.versions;
      const result=await req('articles/'+draft.id,'PUT',{...draft,status:'published',syncTranslations:true,sourceLanguage:'zh',baseVersion:versions.articles[draft.id]});assert.equal(result.status,200);draft=result.body;
      assert.equal(draft.translationPending,false);
      for(const lang of ['en','fr','ary','zh']){assert.ok(draft.title[lang]);assert.ok(draft.excerpt[lang]);assert.equal(draft.bodyFormat[lang],'html');assert.match(draft.body[lang],/src="\/assets\/service-sea.jpg"/);assert.match(draft.body[lang],/<table>/);assert.doesNotMatch(draft.body[lang],/@@BARSAN_/);}
      const before=calls;const again=await req('articles/'+draft.id,'PUT',{...draft,syncTranslations:true,sourceLanguage:'zh'});assert.equal(again.status,200);assert.equal(calls,before);
    });
    await t.test('single-field site edits synchronize all languages and shared contact edits need no translation',async()=>{
      const data=(await req('data')).body;data.settings.ui.zh.heroAccent='中国至摩洛哥，一站式运输。';data.settings.ui.zh.companyMissionText='让每一票国际货物运输更简单。';
      const result=await req('settings','PUT',{...data.settings,syncTranslations:true,sourceLanguage:'zh',baseVersion:data.versions.settings});assert.equal(result.status,200);
      const saved=(await req('data')).body;assert.equal(saved.settings.ui.en.heroAccent,'[en] 中国至摩洛哥，一站式运输。');assert.equal(saved.settings.ui.fr.heroAccent,'[fr] 中国至摩洛哥，一站式运输。');assert.equal(saved.settings.ui.ary.heroAccent,'[ary] 中国至摩洛哥，一站式运输。');for(const l of ['en','fr','ary'])assert.equal(saved.settings.ui[l].companyMissionText,'['+l+'] 让每一票国际货物运输更简单。');
      const before=calls;saved.settings.email='new@example.com';assert.equal((await req('settings','PUT',{...saved.settings,syncTranslations:true,baseVersion:saved.versions.settings})).status,200);assert.equal(calls,before);
    });
    await t.test('hidden Chinese remains a publication source and re-enabled languages retain synchronized content',async()=>{
      const before=(await req('data')).body;const count=calls;
      const toggled=await req('languages','PUT',{enabledLanguages:['fr','ary'],defaultLanguage:'fr',baseVersion:before.versions.settings});assert.equal(toggled.status,200);assert.equal(calls,count);
      const result=await req('articles','POST',{slug:'hidden-chinese-source',category:'company',date:'2026-01-01',status:'published',title:{zh:'中文后台新闻'},excerpt:{zh:'前台只显示已开启语言'},body:{zh:'<h2>中文原文</h2><p>在后台编辑中文，再同步到官网。</p><figure><img src="/assets/port.jpg" alt="港口"></figure>'},bodyFormat:{zh:'html'},syncTranslations:true,sourceLanguage:'zh'});
      assert.equal(result.status,201);assert.equal(result.body.title.zh,'中文后台新闻');
      for(const language of ['en','fr','ary']){assert.equal(result.body.title[language],'['+language+'] 中文后台新闻');assert.match(result.body.body[language],/<img src="\/assets\/port.jpg"/);}
      const data=(await req('data')).body;
      assert.deepEqual(data.settings.enabledLanguages,['fr','ary']);assert.ok(data.settings.ui.zh.companyMissionText);
      const restored=await req('languages','PUT',{enabledLanguages:['en','fr','ary','zh'],defaultLanguage:before.settings.defaultLanguage,baseVersion:data.versions.settings});assert.equal(restored.status,200);
      assert.equal((await req('data')).body.articles.find(a=>a.id===result.body.id).title.zh,'中文后台新闻');
    });
    await t.test('visual save is atomic when a later article translation fails',async()=>{
      const data=(await req('data')).body;const settings=structuredClone(data.settings);settings.ui.zh.heroText='可视化页面的新介绍。';const article=structuredClone(data.articles.find(a=>a.id===draft.id));article.body.zh='<p>BROKEN_RESPONSE</p>';
      const result=await req('content','PUT',{settings,articles:[article],sourceLanguage:'zh',baseVersions:data.versions});assert.equal(result.status,502);
      const saved=(await req('data')).body;assert.deepEqual(saved.settings,data.settings);assert.deepEqual(saved.articles.find(a=>a.id===draft.id),data.articles.find(a=>a.id===draft.id));
      article.body.zh='<p>可视化编辑同步后的正文。</p><img src="/assets/service-sea.jpg">';
      const retry=await req('content','PUT',{settings,articles:[article],sourceLanguage:'zh',baseVersions:data.versions});assert.equal(retry.status,200);assert.equal(retry.body.settings.ui.en.heroText,'[en] 可视化页面的新介绍。');assert.match(retry.body.articles.find(a=>a.id===draft.id).body.fr,/\[fr\]/);
    });
    await t.test('malformed HTML translations and provider errors never publish partial content or expose keys',async()=>{
      const data=(await req('data')).body;const article=structuredClone(data.articles.find(a=>a.id===draft.id));article.body.zh='<p>BROKEN_MARKUP</p>';assert.equal((await req('articles/'+article.id,'PUT',{...article,syncTranslations:true,sourceLanguage:'zh'})).status,502);
      mode='unauthorized';article.title.zh='鉴权失败时的独有测试标题';const failed=await req('articles/'+article.id,'PUT',{...article,syncTranslations:true,sourceLanguage:'zh'});assert.equal(failed.status,502);assert.ok(!JSON.stringify(failed.body).includes(apiKey));mode='ok';
      assert.deepEqual((await req('data')).body.articles.find(a=>a.id===draft.id),data.articles.find(a=>a.id===draft.id));
    });
    await t.test('concurrent changes are detected after translation and stale edits are rejected',async()=>{
      const data=(await req('data')).body;const first=structuredClone(data.settings);first.ui.zh.heroAccent='并发翻译冲突的测试文案。';
      mode='wait';const entered=new Promise(resolve=>reached=resolve);const pending=req('settings','PUT',{...first,syncTranslations:true,sourceLanguage:'zh',baseVersion:data.versions.settings});await Promise.race([entered,pending.then(result=>{throw Error('Unexpected early save response '+JSON.stringify(result));})]);
      const second=structuredClone(data.settings);second.email='concurrent@example.com';assert.equal((await req('settings','PUT',{...second,syncTranslations:true,baseVersion:data.versions.settings})).status,200);
      mode='ok';release();assert.equal((await pending).status,409);const saved=(await req('data')).body;assert.equal(saved.settings.email,'concurrent@example.com');assert.equal(saved.settings.ui.zh.heroAccent,data.settings.ui.zh.heroAccent);
      assert.equal((await req('settings','PUT',{...first,baseVersion:data.versions.settings})).status,409);
    });
    await t.test('long HTML bodies retain paragraph boundaries, markup and images across translation chunks',async()=>{
      const data=(await req('data')).body;const article=structuredClone(data.articles.find(a=>a.id===draft.id));const paragraph='<p>长文分段测试，提前确认货物资料和运输节点。</p>\n';article.body.zh='<h2>长篇货运说明</h2>\n'+paragraph.repeat(90)+'<figure><img src="/assets/service-sea.jpg"><figcaption>货轮配图</figcaption></figure>';
      const result=await req('articles/'+article.id,'PUT',{...article,syncTranslations:true,sourceLanguage:'zh',baseVersion:data.versions.articles[article.id]});assert.equal(result.status,200);
      for(const lang of ['en','fr','ary']){assert.equal((result.body.body[lang].match(/<p>/g)||[]).length,90);assert.match(result.body.body[lang],/src="\/assets\/service-sea.jpg"/);assert.doesNotMatch(result.body.body[lang],/@@BARSAN_/);assert.match(result.body.body[lang],/\n/);}
    });
    await t.test('public event stream announces a committed content update',async()=>{
      const response=await fetch(base+'/api/site/events');assert.equal(response.headers.get('content-type'),'text/event-stream; charset=utf-8');const reader=response.body.getReader();await reader.read();
      const data=(await req('data')).body;data.settings.phone='+212600123456';assert.equal((await req('settings','PUT',{...data.settings,syncTranslations:true,baseVersion:data.versions.settings})).status,200);
      const event=await reader.read();assert.match(new TextDecoder().decode(event.value),/event: site-update/);await reader.cancel();
    });
  } finally {
    release?.();if(child.exitCode===null)await new Promise(resolve=>{child.once('exit',resolve);child.kill('SIGTERM');});
    upstream.closeAllConnections();await new Promise(resolve=>upstream.close(resolve));await rm(dir,{recursive:true,force:true});
  }
});
