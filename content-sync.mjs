import {LANGUAGES} from './public/languages.js';
import {contentVersion} from './translation.mjs';

const fail = (status, message) => { throw Object.assign(new Error(message), {status}); };
const changed = (a, b) => String(a || '').trim() !== String(b || '').trim();

export function createContentWriter({db, translation, validateArticle, validateConfig, onSaved}) {
  const readSettings = () => db.prepare('SELECT value FROM config WHERE id=1').get().value;
  const readArticle = id => db.prepare('SELECT value FROM articles WHERE id=?').get(id)?.value;
  const settingsSnapshot = () => ({kind:'settings', raw:readSettings()});
  function articleSnapshot(id) {
    const raw = readArticle(id);
    if (!raw) fail(404, '文章不存在');
    return {kind:'article', id, raw};
  }
  function verifyBase(snapshot, expected) {
    if (expected && expected !== contentVersion(JSON.parse(snapshot.raw))) {
      fail(409, '内容已在其他窗口更新，请刷新后再编辑');
    }
  }
  function commit(snapshots, write) {
    db.exec('BEGIN IMMEDIATE');
    try {
      for (const snapshot of snapshots) {
        const current = snapshot.kind === 'settings' ? readSettings() : readArticle(snapshot.id);
        if (current !== snapshot.raw) fail(409, '翻译期间内容已在其他窗口更新，请刷新后重试');
      }
      write();
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    onSaved();
  }

  function planFields(next, previous, fields, preferredSource) {
    const jobs = [];
    for (const {key, maxLength, format} of fields) {
      const values = next[key];
      const changedLanguages = LANGUAGES.filter(language =>
        changed(values[language], previous?.[key]?.[language]) ||
        (key === 'body' && (next.bodyFormat?.[language] || 'text') !== (previous?.bodyFormat?.[language] || 'text'))
      );
      let sourceLanguage;
      if (changedLanguages.length === 1) sourceLanguage = changedLanguages[0];
      else if (changedLanguages.length > 1) {
        if (!changedLanguages.includes(preferredSource)) fail(400, '同一内容修改了多种语言，请选择本次编辑语言后保存');
        sourceLanguage = preferredSource;
      } else if (LANGUAGES.some(language => !values[language])) {
        sourceLanguage = values[preferredSource] ? preferredSource : LANGUAGES.find(language => values[language]);
      }
      if (sourceLanguage) jobs.push({key, sourceLanguage, text:values[sourceLanguage], maxLength, format:format?.(sourceLanguage) || 'text'});
    }
    return jobs;
  }

  async function applyJobs(next, jobs) {
    for (const job of jobs) {
      next[job.key] = {...next[job.key], ...await translation.translate(job)};
      if (job.key === 'body') {
        next.bodyFormat ||= {};
        for (const language of LANGUAGES) next.bodyFormat[language] = job.format;
      }
    }
  }

  async function prepareSettings(input, previous, service) {
    const next = validateConfig(input);
    if (!service.configured && !input.syncTranslations) return next;
    const uiFields = Object.keys(next.ui.en).map(key => ({key, maxLength:6000}));
    const byField = Object.fromEntries(uiFields.map(({key}) => [key, Object.fromEntries(LANGUAGES.map(l => [l, next.ui[l][key]]))]));
    const oldFields = Object.fromEntries(uiFields.map(({key}) => [key, Object.fromEntries(LANGUAGES.map(l => [l, previous.ui[l][key]]))]));
    const jobs = planFields(byField, oldFields, uiFields, input.sourceLanguage);
    if (jobs.length && !service.configured) fail(503, '请先在后台「自动翻译」填写千问 API Key');
    await applyJobs(byField, jobs);
    for (const {key} of uiFields) for (const language of LANGUAGES) next.ui[language][key] = byField[key][language];
    return validateConfig(next);
  }

  async function prepareArticle(input, id, previous, service) {
    const automatic = service.configured || input.syncTranslations === true;
    const next = validateArticle(input, id, {allowMissingTranslations:automatic});
    if (!automatic) return next;
    const fields = [{key:'title', maxLength:250}, {key:'excerpt', maxLength:800},
      {key:'body', maxLength:60000, format:language => next.bodyFormat[language]}];
    const jobs = planFields(next, previous, fields, input.sourceLanguage);
    if (jobs.length && !service.configured) {
      if (next.status === 'published') fail(503, '请先配置千问 API Key，再保存并同步发布');
      return {...next, translationPending:true};
    }
    await applyJobs(next, jobs);
    return {...validateArticle(next, id), translationPending:false};
  }

  async function saveSettings(input) {
    const snapshot = settingsSnapshot();
    verifyBase(snapshot, input.baseVersion);
    const next = await prepareSettings(input, JSON.parse(snapshot.raw), await translation.status());
    commit([snapshot], () => db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(next)));
    return next;
  }

  async function saveArticle(input, id, isNew = false) {
    const snapshot = isNew ? null : articleSnapshot(id);
    if (snapshot) verifyBase(snapshot, input.baseVersion);
    const next = await prepareArticle(input, id, snapshot ? JSON.parse(snapshot.raw) : null, await translation.status());
    commit(snapshot ? [snapshot] : [], () => {
      if (isNew) db.prepare('INSERT INTO articles VALUES(?,?,?)').run(id, next.slug, JSON.stringify(next));
      else db.prepare('UPDATE articles SET slug=?,value=? WHERE id=?').run(next.slug, JSON.stringify(next), id);
    });
    return next;
  }

  async function saveVisual(input) {
    if (!Array.isArray(input.articles) || input.articles.length > 100) fail(400, '无效的页面修改');
    const settings = settingsSnapshot();
    verifyBase(settings, input.baseVersions?.settings);
    const snapshots = new Map();
    for (const article of input.articles) {
      if (snapshots.has(article.id)) fail(400, '文章修改重复');
      const snapshot = articleSnapshot(article.id);
      verifyBase(snapshot, input.baseVersions?.articles?.[article.id]);
      snapshots.set(article.id, snapshot);
    }
    const service = await translation.status();
    const controls = {syncTranslations:true, sourceLanguage:input.sourceLanguage};
    const nextSettings = await prepareSettings({...input.settings, ...controls}, JSON.parse(settings.raw), service);
    const nextArticles = [];
    for (const article of input.articles) {
      nextArticles.push(await prepareArticle({...article, ...controls}, article.id, JSON.parse(snapshots.get(article.id).raw), service));
    }
    commit([settings, ...snapshots.values()], () => {
      db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(nextSettings));
      for (const article of nextArticles) db.prepare('UPDATE articles SET slug=?,value=? WHERE id=?').run(article.slug, JSON.stringify(article), article.id);
    });
  }
  return {saveSettings, saveArticle, saveVisual};
}
