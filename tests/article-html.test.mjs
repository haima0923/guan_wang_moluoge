import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanArticleHtml,importArticleHtml} from '../article-html.mjs';
import {renderArticleBody} from '../public/article-format.js';

test('HTML import keeps article structure, uses local images and extracts editable metadata',async()=>{
 const r=await importArticleHtml('<!doctype html><html><head><title>Page title</title><style>body{display:none}</style></head><body><h1>Shipping &amp; delivery</h1><p>Introduction.</p><h2>Documents</h2><ul><li>Invoice</li></ul><table><tr><th>Origin</th><td>Yiwu</td></tr></table><figure><img src="images/cargo.jpg" alt="Cargo"><figcaption>Photo caption</figcaption></figure></body></html>',{imageMap:{'cargo.jpg':'/assets/service-sea.jpg'}});
 assert.equal(r.title,'Shipping & delivery');assert.equal(r.excerpt,'Introduction.');assert.equal(r.bodyFormat,'html');assert.deepEqual(r.missingImages,[]);assert.match(r.body,/<h2>Documents/);assert.match(r.body,/<table>/);assert.match(r.body,/src="\/assets\/service-sea.jpg"/);assert.match(r.body,/<figcaption>Photo caption/);assert.doesNotMatch(r.body,/<h1|<style|<head/);
});
test('HTML scripts, active content, CSS and unsafe URLs are removed',()=>{
 const html=cleanArticleHtml('<p id="x" onclick="alert(1)" style="position:fixed">Hello</p><script>alert(1)</script><iframe src="/admin"></iframe><svg onload="alert(1)"></svg><a href="jav&#97;script:alert(1)">bad</a><img src="/assets/port.jpg" onerror="alert(1)"><img src="https://remote.example/tracker.png"><form action="/api/admin/logout"><input name="x"></form>');
 assert.doesNotMatch(html,/<script|<iframe|<svg|<form|<input|onclick|onerror|style=|javascript:|src="https:/i);assert.match(html,/<p>Hello<\/p>/);assert.match(html,/noopener noreferrer/);assert.match(html,/待补充图片/);
});
test('embedded images become reusable uploaded assets and missing files get visible placeholders',async()=>{
 const calls=[];const r=await importArticleHtml('<h1>Title</h1><p>Before</p><img alt="ship" src="data:image/png;base64,YWJj"><p>Middle</p><img src="missing.jpg"><p>After</p>',{upload:async input=>{calls.push(input);return {url:'/media/'+('a'.repeat(32))+'.png'};}});
 assert.equal(calls.length,1);assert.equal(calls[0].imagesOnly,true);assert.equal(calls[0].alt,'ship');assert.equal(r.embeddedImages,1);assert.deepEqual(r.missingImages,['missing.jpg']);assert.ok(r.body.indexOf('/media/')<r.body.indexOf('Middle'));assert.ok(r.body.indexOf('待补充图片')<r.body.indexOf('After'));
});
test('text articles support inline-position figures without accepting remote or executable image URLs',()=>{
 const html=renderArticleBody('Before\n\n![Cargo photo](/assets/service-sea.jpg)\n\nAfter');assert.match(html,/<figure><img src="\/assets\/service-sea.jpg" alt="Cargo photo"/);assert.match(html,/<figcaption>Cargo photo<\/figcaption>/);assert.ok(html.indexOf('Before')<html.indexOf('<figure>'));assert.ok(html.indexOf('<figure>')<html.indexOf('After'));
 assert.doesNotMatch(renderArticleBody('![x](javascript:alert(1))\n\n![x](https://external.test/a.jpg)'),/<img/);
});
