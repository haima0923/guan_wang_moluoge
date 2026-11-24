import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createTranslationService} from '../translation.mjs';
import {setTimeout as delay} from 'node:timers/promises';

const privateKey = 'fixture-private-qwen-key';
function inputOf(options) {
  const payload = JSON.parse(options.body);
  assert.equal(payload.stream, true);
  return JSON.parse(payload.messages.at(-1).content);
}
function completion(input) {
  return JSON.stringify({translations:Object.fromEntries(Object.keys(input.targetLanguages).map(language => [language,input.textNodes
    ? Object.fromEntries(input.textNodes.map(node=>[node.id,node.text]))
    : input.text]))});
}
function jsonResponse(input) {
  return Response.json({choices:[{finish_reason:'stop',message:{content:completion(input)}}]});
}
function streamResponse(content, {finished=true} = {}) {
  const split = Math.floor(content.length / 2);
  const records = [content.slice(0, split),content.slice(split)].map(text =>
    'data: ' + JSON.stringify({choices:[{delta:{content:text},finish_reason:null}]}) + '\r\n\r\n');
  if (finished) records.push('data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\ndata: [DONE]');
  const bytes = new TextEncoder().encode(records.join(''));
  const body = new ReadableStream({start(controller) {
    for (let i=0;i<bytes.length;i+=7) controller.enqueue(bytes.slice(i,i+7));
    controller.close();
  }});
  return new Response(body,{headers:{'Content-Type':'text/event-stream; charset=utf-8'}});
}
function fixture(fetchImpl, options={}) {
  const db = new DatabaseSync(':memory:');
  const service = createTranslationService({db,dataDir:'/unused',env:{DASHSCOPE_API_KEY:privateKey},fetchImpl,retryDelayMs:0,...options});
  return {db,service};
}

test('streamed JSON survives UTF-8 and SSE boundaries and restores HTML exactly', async () => {
  const html = '<h2>摩洛哥运输 المغرب</h2><p>你好，世界。مرحبا</p><img src="/assets/port.jpg">';
  let calls = 0;
  const {db,service} = fixture(async (url,options) => {calls++;return streamResponse(completion(inputOf(options)));});
  try {
    const result = await service.translate({sourceLanguage:'zh',text:html,format:'html'});
    for (const language of ['en','fr','ary','zh']) assert.equal(result[language],html);
    assert.equal(calls,3);
  } finally {db.close();}
});

test('an interrupted stream retries and an extra unrecognized markup token is rejected', async t => {
  t.mock.method(console,'warn',()=>{});
  let calls = 0;
  const {db,service} = fixture(async (url,options) => {
    const input = inputOf(options);calls++;
    if (input.text==='garbage') return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify({translations:{en:'ok @@BARSAN_001@@',fr:'ok',ary:'ok'}})}}]});
    return streamResponse(completion(input),{finished:calls>1});
  });
  try {
    assert.equal((await service.translate({sourceLanguage:'zh',text:'请求被中断'})).fr,'请求被中断');
    assert.equal(calls,2);
    await assert.rejects(service.translate({sourceLanguage:'zh',text:'garbage'}),/排版或图片标记/);
    assert.equal(calls,4);
  } finally {db.close();}
});

test('request timeout retries once and returns a specific safe error', async t => {
  t.mock.method(console,'warn',()=>{});
  let calls = 0;
  const {db,service} = fixture(async (url,options) => {
    calls++;
    return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true}));
  },{requestTimeoutMs:20});
  try {
    await assert.rejects(service.translate({sourceLanguage:'zh',text:'超时回归测试'}), error => error.status===502 && /等待超时/.test(error.message) && !error.message.includes(privateKey));
    assert.equal(calls,2);
    assert.equal(db.prepare('SELECT COUNT(*) n FROM translation_cache').get().n,0);
  } finally {db.close();}
});

test('plain titles and HTML nodes do not invite invented formatting tokens, while real URLs stay protected', async () => {
  const seen=[];
  const {db,service}=fixture(async (url,options)=>{
    const payload=JSON.parse(options.body),input=inputOf(options);
    const needsMarkers=/@@BARSAN_/.test(input.text || '');
    assert.equal(payload.messages[0].content.includes('@@BARSAN_'),needsMarkers);
    seen.push(needsMarkers);
    return jsonResponse(input);
  });
  try {
    const title='Même marchandise, deux devis de transport très différents. Que faut-il comparer ?';
    assert.equal((await service.translate({sourceLanguage:'fr',text:title,maxLength:250})).ary,title);
    const html='<p>Les frais à comparer</p><img src="/assets/service-sea.jpg">';
    assert.equal((await service.translate({sourceLanguage:'fr',text:html,format:'html'})).ary,html);
    const linked='Consultez https://www.portnet.ma/ pour préparer les documents.';
    assert.equal((await service.translate({sourceLanguage:'fr',text:linked})).ary,linked);
    assert.ok(seen.includes(true) && seen.includes(false));
  } finally {db.close();}
});

test('authentication and quota errors do not retry, while a transient 503 does', async t => {
  const warnings=[];
  t.mock.method(console,'warn',(...parts)=>warnings.push(parts.join(' ')));
  for (const status of [401,403,429,503]) {
    let calls=0;
    const {db,service}=fixture(async (url,options)=>{
      calls++;
      if(status===503&&calls===2)return jsonResponse(inputOf(options));
      return Response.json({error:privateKey},{status});
    });
    try {
      const pending=service.translate({sourceLanguage:'zh',text:'服务错误 '+status});
      if(status===503){await pending;assert.equal(calls,2);}
      else {await assert.rejects(pending,error=>error.status===502&&!error.message.includes(privateKey));assert.equal(calls,1);}
    } finally {db.close();}
  }
  assert.ok(warnings.every(message=>!message.includes(privateKey)));
});

test('a retry of a long article reuses completed chunks and preserves original order', async t => {
  t.mock.method(console,'warn',()=>{});
  let failing=true,calls=0;
  const successes=new Set(),secondAttempt=[];
  const {db,service}=fixture(async (url,options)=>{
    calls++;const input=inputOf(options);
    if(!failing)secondAttempt.push(input.text);
    if(failing&&input.text.includes('FAIL_SEGMENT'))return Response.json({error:'temporary'},{status:503});
    successes.add(input.text);await delay(2);return jsonResponse(input);
  });
  const text=Array.from({length:9},(_,i)=>'段落'+i+' '+('文本内容 '.repeat(150))+(i===4?' FAIL_SEGMENT':'')).join('\n');
  try {
    await assert.rejects(service.translate({sourceLanguage:'zh',text}),/503/);
    assert.ok(db.prepare("SELECT COUNT(*) n FROM translation_cache WHERE id LIKE 'segment-v2:%'").get().n>0);
    const completedBeforeRetry=new Set(successes);
    failing=false;
    const result=await service.translate({sourceLanguage:'zh',text});
    assert.equal(result.en,text.trim());assert.equal(result.fr,text.trim());assert.equal(result.ary,text.trim());
    assert.ok(secondAttempt.length>0);
    assert.ok(secondAttempt.every(segment=>!completedBeforeRetry.has(segment)));
    const before=calls;await service.translate({sourceLanguage:'zh',text});assert.equal(calls,before);
  } finally {db.close();}
});

test('HTML stays on the server while visible text is translated and escaped safely', async () => {
  const {db,service}=fixture(async (url,options)=>{
    const input=inputOf(options);
    assert.ok(input.textNodes.length>0);
    assert.ok(input.textNodes.every(node=>!node.text.includes('<img')));
    assert.ok(input.textNodes.some(node=>node.text.includes('A & B')));
    const translations=Object.fromEntries(Object.keys(input.targetLanguages).map(language=>[language,Object.fromEntries(input.textNodes.map(node=>[node.id,'<b>Translated</b> & '+node.text]))]));
    return streamResponse(JSON.stringify({translations}));
  });
  try {
    const result=await service.translate({sourceLanguage:'zh',format:'html',text:'<p>A &amp; B</p><figure><img src="/assets/port.jpg" alt="a > b"><figcaption>港口</figcaption></figure>'});
    assert.ok(result.fr.includes('<img src="/assets/port.jpg" alt="a > b">'));
    assert.ok(result.fr.includes('&lt;b&gt;Translated&lt;/b&gt; &amp; A &amp; B'));
    assert.ok(!result.fr.includes('<b>'));
    assert.equal((result.fr.match(/<figure>/g)||[]).length,1);
  } finally {db.close();}
});

test('HTML retry preserves successful language chunks instead of retranslating them', async t => {
  t.mock.method(console,'warn',()=>{});
  let failing=true;
  const retryLanguages=[];
  const {db,service}=fixture(async (url,options)=>{
    const input=inputOf(options);
    const languages=Object.keys(input.targetLanguages);
    assert.equal(languages.length,1);
    const language=languages[0];
    if(!failing)retryLanguages.push(language);
    if(failing&&language==='fr')return Response.json({error:'temporary'},{status:503});
    return jsonResponse(input);
  });
  const html='<h2>运输计划</h2><p>请核对货物信息。</p><img src="/assets/port.jpg">';
  try {
    await assert.rejects(service.translate({sourceLanguage:'zh',text:html,format:'html'}),/503/);
    assert.ok(db.prepare("SELECT count(*) n FROM translation_cache WHERE id LIKE 'html-nodes-v2:%'").get().n>=1);
    failing=false;
    const result=await service.translate({sourceLanguage:'zh',text:html,format:'html'});
    assert.equal(result.fr,html);
    assert.ok(retryLanguages.includes('fr'));
    assert.ok(!retryLanguages.includes('en'));
  } finally {db.close();}
});

test('overlapping translations share duplicate work and respect two provider requests at a time', async () => {
  let active=0,maximum=0,calls=0;
  const {db,service}=fixture(async (url,options)=>{
    active++;calls++;maximum=Math.max(active,maximum);await delay(10);active--;
    return jsonResponse(inputOf(options));
  });
  try {
    const result=await Promise.all(['one','two','three','one'].map(text=>service.translate({sourceLanguage:'zh',text})));
    assert.equal(calls,3);assert.equal(maximum,2);assert.equal(result[0].en,'one');assert.equal(result[3].fr,'one');
  } finally {db.close();}
});
