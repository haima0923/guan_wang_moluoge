// All four languages remain available to administrators, regardless of public visibility.
export const REQUIRED_LANGUAGES = ['en', 'fr', 'ary'];
export const LANGUAGES = [...REQUIRED_LANGUAGES, 'zh'];
export const LANGUAGE_LABELS = {en:'English', fr:'Français', ary:'الدارجة', zh:'中文'};
export function getPublicLanguages(settings){
 const configured=settings?.enabledLanguages;
 const enabled=Array.isArray(configured)?LANGUAGES.filter(language=>configured.includes(language)):LANGUAGES;
 return enabled.length?enabled:[...LANGUAGES];
}
export function getDefaultLanguage(settings){
 const enabled=getPublicLanguages(settings);
 return enabled.includes(settings?.defaultLanguage)?settings.defaultLanguage:enabled[0];
}
