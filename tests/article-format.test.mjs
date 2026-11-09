import {test} from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {renderArticleBody} from '../public/article-format.js';
import {completeGuides} from '../article-content.mjs';
test('guide formatting supports readable sections and safe reference links',()=>{
 const html=renderArticleBody('## Preparation\n\nFirst paragraph.\n\n- Invoice\n- Packing list\n\n[PortNet](https://www.portnet.ma/titre-d-importation)');
 assert.match(html,/<h2>Preparation<\/h2>/);assert.match(html,/<ul><li>Invoice<\/li><li>Packing list<\/li><\/ul>/);assert.match(html,/href="https:\/\/www.portnet.ma\/titre-d-importation"/);assert.match(html,/rel="noopener noreferrer"/);
});
test('article HTML remains inert and unsafe links are not activated',()=>{
 const html=renderArticleBody('## <img src=x onerror=alert(1)>\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))');
 assert.ok(!/<script|<img|href="javascript:/i.test(html));assert.ok(html.includes('&lt;script&gt;'));
});
test('all three completed guides have four languages, real covers and structured bodies',async()=>{
 assert.equal(completeGuides.length,3);
 for(const article of completeGuides){await access(new URL('../public'+article.cover,import.meta.url));for(const language of ['en','fr','ary','zh']){assert.ok(article.title[language]);assert.ok(article.excerpt[language]);assert.ok(article.body[language].length>500);assert.ok((article.body[language].match(/^## /gm)||[]).length>=5);}}
});
