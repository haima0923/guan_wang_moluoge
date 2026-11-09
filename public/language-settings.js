import {LANGUAGES,LANGUAGE_LABELS,getPublicLanguages,getDefaultLanguage} from '/languages.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={en:'英语',fr:'法语',ary:'摩洛哥 Darija',zh:'中文'};
export function createLanguageSettings({api,getData,toast,onDirty,onSaved}){
 return {mount(root){
  const data=getData(),enabled=getPublicLanguages(data.settings);
  root.innerHTML=`<form class="panel settings-panel language-settings-panel"><div class="panel-heading"><h2>官网语言显示</h2><span class="badge purple" data-enabled-count></span></div><fieldset class="language-options"><legend>选择访客可以看到的语言</legend><p class="language-description">关闭后，官网语言菜单将隐藏该语言，原有链接自动跳转到默认语言。后台编辑和内容均保留。</p>${LANGUAGES.map(language=>`<label class="language-option"><span class="language-option-copy"><strong>${escape(names[language])}<small>${escape(LANGUAGE_LABELS[language])} · ${language.toUpperCase()}</small></strong><span>${language==='zh'?'可关闭前台显示，继续在后台用中文编辑和上传文章':'关闭前台后，后台仍可编辑此语言'}</span></span><span class="language-switch"><input type="checkbox" role="switch" name="enabledLanguages" value="${language}" aria-label="前台显示${escape(names[language])}" ${enabled.includes(language)?'checked':''}><span aria-hidden="true"></span></span></label>`).join('')}<label class="language-default">新访客默认语言<select name="defaultLanguage" aria-label="新访客默认语言"></select></label><p class="field-hint">至少保留一种前台语言；默认语言必须处于开启状态。</p></fieldset><div class="language-editing-note"><strong>中文始终可作为后台编辑语言</strong><p>在文章编辑或可视化页面编辑中选择中文，保存时通过千问自动翻译并同步各语言。前台只展示上方开启的语言；以后重新开启中文，也无需重新上传内容。</p><p>${data.translation?.configured?'千问已配置，可用中文更新官网内容。':'千问尚未配置：请先在「自动翻译」中填写 API Key。配置前可保存文章草稿。'}</p></div><div class="content-save"><button class="button" type="submit">保存语言设置</button><span data-language-message role="status"></span></div></form>`;
  const form=root.querySelector('form'),select=form.elements.defaultLanguage,message=root.querySelector('[data-language-message]');
  const selected=()=>[...form.querySelectorAll('[name=enabledLanguages]:checked')].map(input=>input.value);
  function update(preferred=select.value||getDefaultLanguage(data.settings)){
   const languages=selected();
   select.innerHTML=languages.map(language=>`<option value="${language}" ${preferred===language?'selected':''}>${escape(names[language])} · ${escape(LANGUAGE_LABELS[language])}</option>`).join('');
   if(languages.length&&!languages.includes(preferred))select.value=languages[0];
   root.querySelector('[data-enabled-count]').textContent=languages.length+' 种语言对外显示';
   form.querySelector('button[type=submit]').disabled=!languages.length;
   message.textContent=languages.length?'':'请至少开启一种前台语言';
  }
  update();
  form.onchange=()=>{update();onDirty(true);};
  form.onsubmit=async event=>{
   event.preventDefault();const languages=selected();if(!languages.length)return;
   const fieldset=form.querySelector('fieldset'),button=form.querySelector('button[type=submit]');fieldset.disabled=true;button.disabled=true;message.textContent='正在保存…';
   try{
    const saved=await api('languages',{method:'PUT',body:JSON.stringify({enabledLanguages:languages,defaultLanguage:select.value,baseVersion:getData().versions.settings})});
    onSaved(saved);onDirty(false);message.textContent='已保存，官网语言显示已更新';toast('语言设置已保存，中文内容保留在后台');
   }catch(error){message.textContent=error.message;}
   finally{fieldset.disabled=false;button.disabled=!selected().length;}
  };
 }};
}
