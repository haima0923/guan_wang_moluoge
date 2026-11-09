import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LANGUAGES,getPublicLanguages,getDefaultLanguage} from '../public/languages.js';
test('public visibility never removes an administrative language and defaults stay enabled',()=>{
 const settings={enabledLanguages:['ary','fr'],defaultLanguage:'zh'};
 assert.deepEqual(getPublicLanguages(settings),['fr','ary']);assert.equal(getDefaultLanguage(settings),'fr');
 assert.ok(LANGUAGES.includes('zh'));assert.deepEqual(getPublicLanguages({}),['en','fr','ary','zh']);
 assert.equal(getDefaultLanguage({enabledLanguages:['zh'],defaultLanguage:'en'}),'zh');
});
