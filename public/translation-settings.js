import {LANGUAGE_LABELS} from './languages.js';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const endpoints = {
  beijing:'https://dashscope.aliyuncs.com/compatible-mode/v1',
  singapore:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
};
export function createTranslationSettings({api, toast, onSaved, onDirty}) {
  async function mount(root) {
    root.innerHTML = '<p>正在加载千问配置…</p>';
    let config;
    try { config = await api('translation'); }
    catch (error) { root.textContent = error.message; return; }
    const region = Object.entries(endpoints).find(([,url])=>url===config.baseUrl)?.[0] || 'custom';
    root.innerHTML = `
      <form class="panel settings-panel translation-panel" id="translation-form">
        <div class="panel-heading"><h2>阿里云千问自动翻译</h2><span class="badge ${config.configured?'green':'gray'}" data-translation-state>${config.configured?'已配置':'待填写 API Key'}</span></div>
        <div class="settings-fields single">
          <p class="translation-description">编辑一种语言，保存时自动翻译并同步英语、法语、摩洛哥 Darija 和中文。官网只显示「前台语言」中开启的语言；后台内容完整保留，中文可一直作为编辑原文。文章标题、摘要、正文和可视化文案均支持同步。</p>
          <label>API Key 所属地域<select name="region" ${config.fromEnvironment?'disabled':''}>
            <option value="beijing" ${region==='beijing'?'selected':''}>华北 2（北京）</option>
            <option value="singapore" ${region==='singapore'?'selected':''}>新加坡</option>
            <option value="custom" ${region==='custom'?'selected':''}>业务空间专属地址 / 其他地域</option>
          </select></label>
          <label>接口地址（Base URL）<input name="baseUrl" type="url" required value="${escape(config.baseUrl)}" maxlength="500" ${config.fromEnvironment?'readonly':''}></label>
          <p class="field-hint">API Key 与接口地域需一致。使用业务空间专属域名时，填写百炼控制台提供的完整 Base URL。</p>
          <label>千问模型<input name="model" required value="${escape(config.model)}" maxlength="120" placeholder="qwen-plus" ${config.fromEnvironment?'readonly':''}></label>
          <label>百炼 API Key<input name="apiKey" type="password" autocomplete="new-password" maxlength="1000" placeholder="${config.configured?'已保存，留空继续使用':'填写你的阿里云百炼 API Key'}" ${config.fromEnvironment?'disabled':''}></label>
          <p class="field-hint">密钥保存在服务端，后台仅显示是否已配置。翻译请求按你在百炼开通的模型计费。</p>
          <p class="field-hint">${config.fromEnvironment?'当前由服务器 DASHSCOPE_API_KEY 环境变量配置。':'填写后保存配置，再测试连接。'}</p>
        </div>
        <div class="content-save">
          <button class="button" type="submit" ${config.fromEnvironment?'disabled':''}>保存千问配置</button>
          <button class="secondary-button" type="button" data-test ${config.configured?'':'disabled'}>测试连接并翻译样例</button>
        </div>
        <p class="translation-message" data-message role="status"></p>
        <div class="translation-sample" data-sample></div>
      </form>`;
    const form = root.querySelector('form');
    const message = root.querySelector('[data-message]');
    const test = root.querySelector('[data-test]');
    form.oninput = () => onDirty(true);
    form.elements.region.onchange = () => {
      const endpoint = endpoints[form.elements.region.value];
      if (endpoint) form.elements.baseUrl.value = endpoint;
    };
    form.onsubmit = async event => {
      event.preventDefault();
      const button = event.submitter;
      button.disabled = true;
      message.textContent = '正在保存千问配置…';
      try {
        config = await api('translation', {method:'PUT', body:JSON.stringify(Object.fromEntries(new FormData(form)))});
        form.elements.apiKey.value = '';
        form.elements.apiKey.placeholder = '已保存，留空继续使用';
        test.disabled = false;
        root.querySelector('[data-translation-state]').textContent = '已配置';
        root.querySelector('[data-translation-state]').className = 'badge green';
        message.textContent = '配置已保存，可以测试连接。此后保存内容时自动同步所有语言。';
        onDirty(false);onSaved(config);toast('千问配置已保存');
      } catch (error) { message.textContent = error.message; }
      finally { button.disabled = false; }
    };
    test.onclick = async () => {
      test.disabled = true;
      test.textContent = '正在调用千问翻译…';
      message.textContent = '正在测试连接与四语翻译，请稍候。';
      try {
        const result = await api('translation/test', {method:'POST', body:'{}'});
        root.querySelector('[data-sample]').innerHTML = Object.entries(result.sample).map(([language,text]) =>
          `<div><strong>${escape(LANGUAGE_LABELS[language])}</strong><p dir="${language==='ary'?'rtl':'ltr'}">${escape(text)}</p></div>`).join('');
        message.textContent = '千问连接和翻译测试成功。';
      } catch (error) { message.textContent = error.message; }
      finally { test.disabled = false;test.textContent = '测试连接并翻译样例'; }
    };
  }
  return {mount};
}
