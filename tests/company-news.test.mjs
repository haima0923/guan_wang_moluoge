import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {companyNews,addCompanyNews,COMPANY_NEWS_VERSION} from '../company-news.mjs';

test('company milestones retain supplied dates and complete articles in all four languages',()=>{
 assert.deepEqual(companyNews.map(a=>a.date),['2025-11-18','2025-06-08','2025-03-18','2021-08-25']);
 assert.match(companyNews[1].title.zh,/50000/);
 for(const article of companyNews){
  assert.equal(article.category,'company');assert.equal(article.status,'published');assert.equal(article.demo,false);
  for(const language of ['en','fr','ary','zh']){
   assert.ok(article.title[language]);assert.ok(article.excerpt[language]);assert.ok(article.body[language].includes('## '));assert.ok(article.body[language].split('\n\n').length>=6);
  }
 }
});

test('adding company news preserves previous articles, matching slugs and later edits or deletions',()=>{
 const db=new DatabaseSync(':memory:');
 try{
  db.exec('CREATE TABLE migrations(id TEXT PRIMARY KEY);CREATE TABLE articles(id TEXT PRIMARY KEY,slug TEXT UNIQUE,value TEXT)');
  const original={id:'original',slug:'user-news',title:{zh:'原有文章'},body:{zh:'保留正文'}};
  const existing={...companyNews[0],id:'existing',title:{...companyNews[0].title,zh:'用户已修改的标题'}};
  const insert=db.prepare('INSERT INTO articles VALUES(?,?,?)');insert.run(original.id,original.slug,JSON.stringify(original));insert.run(existing.id,existing.slug,JSON.stringify(existing));
  addCompanyNews(db);
  assert.equal(db.prepare('SELECT count(*) AS n FROM articles').get().n,5);
  assert.deepEqual(JSON.parse(db.prepare('SELECT value FROM articles WHERE id=?').get('original').value),original);
  assert.equal(JSON.parse(db.prepare('SELECT value FROM articles WHERE id=?').get('existing').value).title.zh,'用户已修改的标题');
  assert.ok(db.prepare('SELECT id FROM migrations WHERE id=?').get(COMPANY_NEWS_VERSION));
  db.prepare('DELETE FROM articles WHERE slug=?').run(companyNews[1].slug);
  addCompanyNews(db);assert.equal(db.prepare('SELECT count(*) AS n FROM articles').get().n,4);
 }finally{db.close();}
});
