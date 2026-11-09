import {SERVICE_CATALOG} from './public/services.js';
export const SERVICES_VERSION = '2026-11-05-six-service-cards';
const englishLabels = ['OCEAN FREIGHT','AIR FREIGHT','LAND TRANSPORTATION','WAREHOUSING','CUSTOMS BROKERAGE','DDP SERVICE'];
const copy = {
  zh:[
    ['国际海运','连接主要国际港口，提供整柜、拼箱、特种柜及冷冻柜运输方案，根据货物与航线需求协调订舱和装运。',['整柜 FCL','拼箱 LCL','特种柜','冷冻柜']],
    ['国际空运','根据货物、时效和航线需求，协调国际空运、包机及门到门运输安排，衔接起运地与目的地。',['国际空运','包机协调','门到门','急件运输']],
    ['集装箱陆运','衔接义乌、广州与主要港口的集装箱拖车、集货和陆路运输，跟进提货、装柜与港口交接。',['集装箱拖车','国内集货','港口衔接','运输跟进']],
    ['仓储服务','提供货物收存、分拣包装、库存管理和一件代发服务，衔接集货、装运与后续配送。',['收货入库','分拣包装','库存管理','一件代发']],
    ['报关报检','围绕进出口报关、商品检验及单证处理，协助确认货物资料、商品归类和清关要求，衔接起运地与目的地流程。',['进出口报关','商品检验','单证处理','政策咨询']],
    ['双清包税','聚焦中国至摩洛哥线路，衔接国内提货、出口报关、目的港清关、税费处理及门到门派送。',['摩洛哥双清','税费处理','海外仓中转','门到门']]
  ],
  en:[
    ['Ocean freight','Connect major ports with FCL, LCL, special-container and reefer options. Coordinate bookings and shipment planning around your cargo and route.',['FCL','LCL','Special containers','Reefer cargo']],
    ['Air freight','Coordinate international air cargo, charter options and door-to-door arrangements around your route, cargo and delivery priorities.',['International air','Charter coordination','Door to door','Urgent shipments']],
    ['Container road transport','Connect Yiwu, Guangzhou and major ports with container haulage and cargo collection. Follow pickup, loading and port handovers.',['Container haulage','Cargo collection','Port connections','Shipment follow-up']],
    ['Warehousing','Bring receiving, storage, sorting, packing, inventory management and order fulfilment together with onward transport and delivery.',['Receiving & storage','Sorting & packing','Inventory management','Order fulfilment']],
    ['Customs brokerage','Coordinate import and export declarations, cargo inspections and documentation. Clarify goods details, classification and clearance requirements.',['Import & export','Cargo inspections','Documentation','Policy guidance']],
    ['DDP service','Coordinate China-to-Morocco pickup, export formalities, destination clearance, duty and tax arrangements, and agreed door-to-door delivery.',['Morocco clearance','Duty & tax handling','Overseas warehousing','Door to door']]
  ],
  fr:[
    ['Fret maritime','Reliez les grands ports avec des solutions FCL, LCL, conteneurs spéciaux et frigorifiques. Coordonnez réservation et expédition selon votre marchandise.',['Conteneur FCL','Groupage LCL','Conteneurs spéciaux','Fret frigorifique']],
    ['Fret aérien','Coordonnez fret aérien international, affrètement et livraison porte-à-porte selon votre itinéraire, vos marchandises et vos délais.',['Fret international','Affrètement','Porte-à-porte','Envois urgents']],
    ['Transport routier de conteneurs','Reliez Yiwu, Guangzhou et les grands ports par camionnage et collecte. Suivez enlèvement, chargement et remise au terminal.',['Camionnage','Collecte en Chine','Liaison portuaire','Suivi du transport']],
    ['Entreposage','Réception, stockage, tri, emballage, gestion des stocks et préparation de commandes, en lien avec le transport et la livraison.',['Réception & stockage','Tri & emballage','Gestion des stocks','Préparation de commandes']],
    ['Dédouanement et inspection','Coordonnez déclarations import-export, inspections et documents. Précisez les informations marchandise, le classement et les exigences douanières.',['Déclarations douanières','Inspection des marchandises','Traitement documentaire','Conseil réglementaire']],
    ['Service DDP','Coordonnez enlèvement en Chine, formalités export, dédouanement au Maroc, droits et taxes, et livraison porte-à-porte convenue.',['Dédouanement au Maroc','Droits & taxes','Entreposage à destination','Porte-à-porte']]
  ],
  ary:[
    ['الشحن البحري','كنربطو الموانئ الرئيسية بحلول ديال الكونتينر الكامل، التجميع والكونتينرات الخاصة والمبرّدة، وكننسقو الحجز والشحن على حساب السلعة والمسار.',['كونتينر كامل FCL','تجميع LCL','كونتينرات خاصة','نقل مبرّد']],
    ['الشحن الجوي','كننسقو الشحن الجوي الدولي، الطيران المخصص والتوصيل من الباب للباب على حساب نوع السلعة، المسار والوقت اللي محتاج.',['شحن جوي دولي','تنسيق طيران مخصص','من الباب للباب','شحن مستعجل']],
    ['النقل البري ديال الكونتينرات','كنربطو ييو وكوانزو بالموانئ الرئيسية بالنقل ديال الكونتينرات وتجميع السلع، وكنتابعو الاستلام، التحميل والتسليم فالميناء.',['نقل الكونتينرات','تجميع السلع فالصين','الربط بالموانئ','تتبع النقل']],
    ['خدمات التخزين','كننسقو استلام وتخزين السلع، الفرز والتغليف، تدبير المخزون وتجهيز الطلبات، مع الربط بالنقل والتوصيل.',['الاستلام والتخزين','الفرز والتغليف','تدبير المخزون','تجهيز الطلبات']],
    ['التخليص والفحص الجمركي','كننسقو التصاريح ديال الاستيراد والتصدير، فحص السلع والوثائق، وكنوضحو معلومات السلعة، التصنيف ومتطلبات الديوانة.',['تصاريح الاستيراد والتصدير','فحص السلع','تدبير الوثائق','استشارة فالمتطلبات']],
    ['خدمة DDP شاملة التخليص والرسوم','كننسقو الاستلام فالصين، تصاريح التصدير، التخليص فالمغرب، تدبير الرسوم والضرائب والتوصيل من الباب للباب حسب الاتفاق.',['التخليص فالمغرب','الرسوم والضرائب','التخزين فالوجهة','من الباب للباب']]
  ]
};
export const serviceCopy = Object.fromEntries(Object.entries(copy).map(([language, rows]) => {
  const fields = {};
  rows.forEach(([title, text, tags], index) => {
    const key = SERVICE_CATALOG[index].key;
    fields[key] = title;
    fields[key + 'Text'] = text;
    fields[key + 'Label'] = englishLabels[index];
    tags.forEach((tag, tagIndex) => fields[key + 'Tag' + (tagIndex + 1)] = tag);
  });
  return [language, fields];
}));

export function upgradeServices(db) {
  if (db.prepare('SELECT id FROM migrations WHERE id=?').get(SERVICES_VERSION)) return;
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec('CREATE TABLE IF NOT EXISTS config_content_backups (migration TEXT PRIMARY KEY, value TEXT NOT NULL)');
    const row = db.prepare('SELECT value FROM config WHERE id=1').get();
    db.prepare('INSERT OR IGNORE INTO config_content_backups VALUES(?,?)').run(SERVICES_VERSION, row.value);
    const settings = JSON.parse(row.value);
    for (const [language, fields] of Object.entries(serviceCopy)) Object.assign(settings.ui[language], fields);
    db.prepare('UPDATE config SET value=? WHERE id=1').run(JSON.stringify(settings));
    db.prepare('INSERT INTO migrations VALUES(?)').run(SERVICES_VERSION);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
