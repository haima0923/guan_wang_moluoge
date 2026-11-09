export const ENQUIRY_COPY_VERSION='2026-11-05-production-enquiry-copy';
export const enquirySuccessCopy={
 en:'Please keep your enquiry reference for follow-up. Our team will review the shipment details you provided.',
 fr:'Conservez votre référence pour le suivi. Notre équipe étudiera les informations de votre expédition.',
 ary:'حتافظ برقم الطلب باش تتابعو معانا. الفريق ديالنا غادي يراجع معلومات الشحنة اللي عطيتينا.',
 zh:'请保留此询价编号，方便后续沟通。我们会根据您提供的货物信息跟进运输需求。'
};
const legacy={
 en:'Keep this reference for follow-up. This local preview does not send email or WhatsApp notifications.',
 fr:'Conservez cette référence pour le suivi. Cette version locale n’envoie pas de notification par e-mail ou WhatsApp.',
 ary:'حتافظ بهاد المرجع للتتبع. هاد النسخة المحلية ما كتصيفطش إشعارات بالإيميل ولا واتساب.',
 zh:'请保留此编号以便后续沟通。本地预览版本不会自动发送邮件或 WhatsApp 通知。'
};
export function upgradeEnquiryCopy(db){
 if(db.prepare('SELECT id FROM migrations WHERE id=?').get(ENQUIRY_COPY_VERSION))return;
 db.exec('BEGIN IMMEDIATE');
 try{
  const row=db.prepare('SELECT value FROM config WHERE id=1').get(),settings=JSON.parse(row.value);let changed=false;
  for(const [language,text] of Object.entries(legacy))if(settings.ui[language].successDetail===text){settings.ui[language].successDetail=enquirySuccessCopy[language];changed=true;}
  if(changed){db.exec('CREATE TABLE IF NOT EXISTS config_content_backups (migration TEXT PRIMARY KEY,value TEXT NOT NULL)');db.prepare('INSERT OR IGNORE INTO config_content_backups VALUES(?,?)').run(ENQUIRY_COPY_VERSION,row.value);db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(settings));}
  db.prepare('INSERT INTO migrations VALUES(?)').run(ENQUIRY_COPY_VERSION);db.exec('COMMIT');
 }catch(error){db.exec('ROLLBACK');throw error;}
}
