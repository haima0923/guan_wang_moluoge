import {randomUUID} from 'node:crypto';

// Company milestones supplied by the site owner; original event dates are retained.
export const COMPANY_NEWS_VERSION='2026-11-05-company-milestones';
export const companyNews=[
 {
  slug:'sri-lanka-branch-colombo',date:'2025-11-18',cover:'/assets/port.jpg',
  title:{zh:'巴森国际斯里兰卡分公司正式成立，南亚服务网络再扩容',en:'Barsan opens its Sri Lanka branch in Colombo, expanding its South Asia network',fr:'Barsan ouvre une filiale à Colombo et renforce son réseau en Asie du Sud',ary:'بارسان كتفتح فرع فسريلانكا وكتوسع شبكة الخدمات ديالها فجنوب آسيا'},
  excerpt:{zh:'斯里兰卡分公司落地科伦坡，衔接海运订舱、目的港清关、本地仓储与末端派送，为中国出口客户完善南亚物流服务。',en:'The Colombo branch connects ocean bookings, destination customs clearance, local warehousing and final delivery for exporters from China.',fr:'La filiale de Colombo relie réservation maritime, dédouanement à destination, entreposage local et livraison finale pour les exportateurs chinois.',ary:'الفرع ديال كولومبو كيربط الحجز البحري بالتخليص فالوجهة، التخزين المحلي والتوصيل النهائي للمصدّرين من الصين.'},
  body:{
   zh:`2025年11月18日，巴森国际斯里兰卡分公司正式成立，落地科伦坡。此次布局进一步拓展了公司在南亚地区的服务网络，为中国出口客户衔接起运地与目的地的物流环节。

## 从订舱到目的地交付

斯里兰卡分公司围绕海运订舱、目的港清关、本地仓储与末端派送开展服务，推动运输安排、到港资料交接与本地操作之间的衔接。客户可围绕同一票货物，统筹沟通运输和目的地交付需求。

## 完善南亚服务网络

科伦坡分公司的成立，是巴森国际完善区域服务网络的一步。通过连接中国出口端与斯里兰卡本地服务环节，公司持续为客户提供更连贯的物流对接。

如有发往斯里兰卡的货物，可向团队提供起运城市、货物品名、件数、重量、体积及最终收货地点，共同确认运输路线与服务范围。`,
   en:`On 18 November 2025, Barsan established its Sri Lanka branch in Colombo. The opening expands the company's South Asia service network and connects origin and destination logistics for exporters from China.

## From booking to destination delivery

The branch supports ocean freight bookings, destination customs clearance, local warehousing and final delivery. Its work brings shipment arrangements, arrival documentation and local operations into a connected process. Customers can coordinate transport and destination delivery requirements for the same shipment.

## Strengthening regional connections

The Colombo opening is a further step in Barsan's regional network development. By linking export operations in China with local services in Sri Lanka, the company aims to provide a more continuous logistics service.

For a shipment to Sri Lanka, share the origin city, goods description, package count, weight, volume and final delivery location with the team to discuss routing and service scope.`,
   fr:`Le 18 novembre 2025, Barsan a créé sa filiale au Sri Lanka, à Colombo. Cette implantation élargit le réseau de services de l'entreprise en Asie du Sud et relie les opérations de départ et d'arrivée pour les exportateurs chinois.

## De la réservation à la livraison

La filiale intervient dans la réservation maritime, le dédouanement à destination, l'entreposage local et la livraison finale. Elle contribue à coordonner le transport, la transmission des documents à l'arrivée et les opérations locales. Les clients peuvent ainsi rapprocher les besoins de transport et de livraison d'une même expédition.

## Renforcer le réseau régional

L'ouverture à Colombo marque une nouvelle étape dans le développement régional de Barsan. En reliant l'exportation depuis la Chine aux services locaux au Sri Lanka, l'entreprise poursuit la construction d'un accompagnement logistique plus continu.

Pour expédier au Sri Lanka, communiquez à l'équipe la ville de départ, la nature des marchandises, le nombre de colis, le poids, le volume et le lieu de livraison afin de préciser l'itinéraire et les prestations.`,
   ary:`نهار 18 نونبر 2025، بارسان فتحت رسميا الفرع ديالها فسريلانكا، فمدينة كولومبو. هاد الخطوة كتوسع شبكة الخدمات ديال الشركة فجنوب آسيا وكتربط مراحل اللوجستيك بين الصين والوجهة.

## من الحجز حتى التسليم

الفرع كيهتم بتنسيق الحجز البحري، التخليص الجمركي فالوجهة، التخزين المحلي والتوصيل النهائي. الخدمة كتربط ترتيبات الشحن بوثائق الوصول والعمليات المحلية، باش الزبون يقدر ينسق النقل والتسليم ديال نفس الشحنة.

## تقوية الشبكة فجنوب آسيا

افتتاح فرع كولومبو خطوة أخرى فتطوير الشبكة الجهوية ديال بارسان. الربط بين التصدير من الصين والخدمات المحلية فسريلانكا كيساعد على استمرارية التنسيق ديال الشحن.

إلا عندك سلعة غادية لسريلانكا، عطينا مدينة الانطلاق، نوع السلعة، عدد الطرود، الوزن، الحجم وعنوان التسليم، باش نراجعو معاك المسار ونطاق الخدمة.`
  }
 },
 {
  slug:'yiwu-smart-warehouse-opening',date:'2025-06-08',cover:'/assets/service-warehouse.jpg',
  title:{zh:'巴森国际义乌智慧仓储中心正式投入运营，仓储面积扩大至50000㎡',en:'Barsan brings its Yiwu smart warehouse into operation, expanding storage space to 50,000 m²',fr:'Le centre logistique intelligent de Barsan à Yiwu entre en service : 50 000 m² de stockage',ary:'مركز التخزين الذكي ديال بارسان فييو بدا الخدمة والمساحة وصلات لـ50 ألف متر مربع'},
  excerpt:{zh:'历时六个月建设，义乌智慧仓储中心投入使用，新增自动化分拣线和智能仓储管理系统，衔接集货、仓储与后续发运。',en:'After six months of construction, the Yiwu centre opens with automated sorting and a smart warehouse management system to connect cargo collection, storage and dispatch.',fr:'Après six mois de travaux, le centre de Yiwu ouvre avec un tri automatisé et un système intelligent de gestion des stocks pour relier collecte, stockage et expédition.',ary:'من بعد ستة شهور ديال البناء، مركز ييو بدا الخدمة بخط للفرز الآلي ونظام ذكي لتدبير المخزون، مع الربط بالتجميع والشحن.'},
  body:{
   zh:`2025年6月8日，历时六个月建设的巴森国际义乌智慧仓储中心正式投入运营，仓储面积扩大至50000㎡。中心新增自动化分拣线和智能仓储管理系统，进一步完善货物在库操作与发运衔接。

## 智慧仓储与分拣作业

围绕货物入库、分拣、存储和出库环节，中心将仓储操作与库存信息管理结合起来。自动化分拣线与仓储管理系统的投入使用，为不同批次货物的处理和后续运输安排提供支持。

## 连接集货与国际运输

义乌是公司开展集货和物流服务的重要节点。智慧仓储中心投入运营后，可更好地衔接供应商交货、货物整理与装运计划，让仓储环节与国际运输需求相配合。

客户安排送仓前，可先与团队确认货物信息、包装及标识要求、送仓批次与后续发运计划，以便协调收货和仓储作业。`,
   en:`On 8 June 2025, Barsan's Yiwu smart warehousing centre entered operation after six months of construction, expanding warehouse space to 50,000 m². The centre adds an automated sorting line and a smart warehouse management system to support storage operations and onward dispatch.

## Sorting and warehouse management

The centre connects receiving, sorting, storage and outbound handling with inventory information management. The sorting line and management system support the processing of different cargo batches and their subsequent transport arrangements.

## Linking collection with international freight

Yiwu is an important location for the company's cargo collection and logistics services. The new centre helps connect supplier deliveries, cargo preparation and shipping plans, bringing warehouse operations closer to international transport requirements.

Before arranging delivery to the warehouse, customers can confirm cargo details, packaging and labelling requirements, delivery batches and onward shipping plans with the team.`,
   fr:`Le 8 juin 2025, le centre de stockage intelligent de Barsan à Yiwu est entré en service après six mois de construction, portant la surface de stockage à 50 000 m². Il intègre une ligne de tri automatisée et un système intelligent de gestion d'entrepôt pour accompagner les opérations et les départs de marchandises.

## Tri et gestion des stocks

Le centre relie réception, tri, stockage et préparation des sorties à la gestion des informations de stock. La ligne de tri et le système de gestion facilitent le traitement des différents lots et leur prise en charge pour le transport suivant.

## Relier collecte et transport international

Yiwu constitue un point important pour les activités de collecte et de logistique de l'entreprise. Le centre rapproche livraisons des fournisseurs, préparation des marchandises et plans d'expédition, en articulant entreposage et besoins de transport international.

Avant une livraison à l'entrepôt, les clients peuvent confirmer les caractéristiques des marchandises, l'emballage, l'étiquetage, les lots à livrer et le programme d'expédition avec l'équipe.`,
   ary:`نهار 8 يونيو 2025، مركز التخزين الذكي ديال بارسان فييو بدا الخدمة من بعد ستة شهور ديال البناء، والمساحة ديال التخزين وصلات لـ50 ألف متر مربع. المركز تزاد فيه خط للفرز الآلي ونظام ذكي لتدبير المخزون، باش يربط عمليات التخزين بالإرسال.

## الفرز وتدبير المخزون

المركز كيربط استقبال السلعة، الفرز، التخزين والخروج ديالها بتدبير معلومات المخزون. خط الفرز والنظام كيساعدو فالتعامل مع دفعات مختلفة ديال السلع وتنسيق النقل من بعد.

## الربط بين التجميع والشحن الدولي

ييو نقطة مهمة فتجميع السلع والخدمات اللوجستيكية ديال الشركة. المركز كيساعد على الربط بين تسليم المورّدين، تحضير السلعة وبرنامج الشحن، باش تكون خدمة المخزن منسجمة مع النقل الدولي.

قبل ما ترتب إرسال السلعة للمخزن، تواصل مع الفريق باش تأكد معلوماتها، شروط التغليف والعلامات، دفعات التسليم وبرنامج الشحن من بعد.`
  }
 },
 {
  slug:'guangzhou-branch-service-centre',date:'2025-03-18',cover:'/assets/service-land.jpg',
  title:{zh:'巴森国际广州分公司正式成立，华南客户服务中心启用',en:'Barsan establishes its Guangzhou branch and South China customer service centre',fr:'Barsan ouvre sa filiale de Guangzhou et son centre de service clients pour le sud de la Chine',ary:'بارسان كتفتح فرع كوانزو ومركز خدمة الزبناء فجنوب الصين'},
  excerpt:{zh:'依托广州港、南沙港、白云机场及珠三角产业集群，广州分公司为华南客户衔接订舱、报关、仓配与跨境专线服务。',en:'The Guangzhou branch connects bookings, customs declarations, warehousing, distribution and cross-border freight services for customers in South China.',fr:'La filiale de Guangzhou relie réservation, déclarations douanières, entreposage, distribution et transport transfrontalier pour les clients du sud de la Chine.',ary:'فرع كوانزو كيربط الحجز، التصريح الجمركي، التخزين والتوزيع بخدمات الشحن الدولي لزبناء جنوب الصين.'},
  body:{
   zh:`2025年3月18日，巴森国际广州分公司正式成立，华南客户服务中心同步启用。此次布局面向华南客户的物流需求，进一步完善公司在中国出口端的服务对接。

## 立足华南运输与产业节点

广州分公司依托广州港、南沙港、白云机场及珠三角产业集群，围绕客户货物的起运地、运输方式与目的地需求，协调相应的运输及配套服务。

## 衔接订舱、报关与仓配

分公司为华南客户提供订舱、报关、仓储配送与跨境专线服务对接。通过连接客户沟通、货物准备与发运安排，让出口物流的各个环节有序衔接。

有华南地区发货需求的客户，可提交货物品名、起运城市、目的地、件数、重量及体积，由团队共同梳理适合的运输方案和操作安排。`,
   en:`On 18 March 2025, Barsan established its Guangzhou branch and opened its South China customer service centre. The expansion supports customers' regional logistics needs and strengthens the company's export-side service coordination in China.

## Connected to regional transport and industry

The branch draws on Guangzhou Port, Nansha Port, Baiyun Airport and the Pearl River Delta's industrial clusters. It coordinates transport and supporting services around customers' cargo origins, transport modes and destinations.

## Connecting bookings, customs and warehouse services

Customers in South China can coordinate bookings, customs declarations, warehousing, distribution and cross-border freight services through the branch. The service connects customer communication, cargo preparation and shipment arrangements across the export process.

For goods departing from South China, provide the cargo description, origin city, destination, package count, weight and volume so the team can discuss transport options and handling arrangements.`,
   fr:`Le 18 mars 2025, Barsan a créé sa filiale de Guangzhou et ouvert son centre de service clients pour le sud de la Chine. Cette implantation accompagne les besoins logistiques régionaux et renforce la coordination des services à l'exportation depuis la Chine.

## Au cœur des transports et de l'industrie régionale

La filiale s'appuie sur le port de Guangzhou, le port de Nansha, l'aéroport de Baiyun et les pôles industriels du delta de la rivière des Perles. Elle coordonne le transport et les prestations associées selon l'origine des marchandises, le mode choisi et la destination.

## Réservation, douane et services d'entrepôt

Les clients du sud de la Chine peuvent y coordonner réservations, déclarations douanières, entreposage, distribution et services de transport transfrontalier. L'accompagnement relie échanges avec le client, préparation des marchandises et organisation du départ.

Pour une expédition depuis le sud de la Chine, transmettez la nature des marchandises, la ville de départ, la destination, le nombre de colis, le poids et le volume afin d'étudier les options de transport.`,
   ary:`نهار 18 مارس 2025، بارسان فتحت رسميا فرع كوانزو ومركز خدمة الزبناء ديال جنوب الصين. هاد التوسع جا باش يقرب التنسيق ديال الخدمات اللوجستيكية من الزبناء ويقوي الربط ديال التصدير من الصين.

## قريب من النقل والصناعة فالمنطقة

الفرع كيعتمد على الربط بميناء كوانزو، ميناء نانشا، مطار باييون والتجمعات الصناعية ديال دلتا نهر اللؤلؤ. كينسق النقل والخدمات المرافقة على حساب مدينة الانطلاق، وسيلة النقل والوجهة.

## الحجز والديوانة والتخزين

زبناء جنوب الصين يقدرو ينسقو مع الفرع الحجز، التصريح الجمركي، التخزين، التوزيع وخدمات الشحن الدولي. الخدمة كتربط التواصل مع الزبون بتحضير السلعة وترتيب الإرسال.

إلا عندك سلعة غادية تخرج من جنوب الصين، عطينا نوعها، مدينة الانطلاق، الوجهة، عدد الطرود، الوزن والحجم، باش نراجعو معاك حلول النقل وترتيبات الخدمة.`
  }
 },
 {
  slug:'morocco-ddp-service-launch',date:'2021-08-25',cover:'/assets/service-ddp.jpg',
  title:{zh:'巴森国际开通摩洛哥双清包税专线服务',en:'Barsan launches its China–Morocco DDP freight service',fr:'Barsan lance son service DDP entre la Chine et le Maroc',ary:'بارسان كتطلق خط الشحن من الصين للمغرب بخدمة DDP'},
  excerpt:{zh:'围绕中国出口客户的摩洛哥发货需求，衔接清关、税费处理与派送，提供一体化的专线服务对接。',en:'The service connects customs clearance, duty and tax handling, and delivery for customers exporting from China to Morocco.',fr:'Le service relie dédouanement, traitement des droits et taxes et livraison pour les clients exportant de Chine vers le Maroc.',ary:'الخط كيربط التخليص الجمركي، تدبير الرسوم والضرائب والتوصيل لزبناء التصدير من الصين للمغرب.'},
  body:{
   zh:`2021年8月25日，巴森国际开通摩洛哥双清包税专线服务，面向中国出口客户提供清关、税费处理与派送相衔接的物流解决方案。

## 围绕中国至摩洛哥的货运需求

专线以摩洛哥目的地交付为服务重点，将中国出口端的准备工作与目的地清关、派送安排连接起来。客户可围绕货物特点、收货地点与发运计划，统一沟通所需的物流环节。

## 衔接清关、税费与派送

通过统筹两端清关协调、税费处理与目的地配送，专线服务帮助客户提前梳理货物流转所需的信息和交接安排。具体承运货物、服务范围与费用组成在询价时确认，便于双方明确每票货物的执行要求。

咨询摩洛哥专线时，请提供品名、包装情况、件数、重量、体积、国内提货地点和摩洛哥收货城市。团队将结合这些信息，协助确认发货准备与交付安排。`,
   en:`On 25 August 2021, Barsan launched its China–Morocco DDP freight service, bringing customs clearance, duty and tax handling, and delivery together for exporters from China.

## Focused on shipments to Morocco

The service centres on delivery in Morocco, connecting export preparation in China with destination customs and delivery arrangements. Customers can coordinate the logistics stages around their goods, delivery location and shipping plans.

## Coordinating clearance, taxes and delivery

By coordinating clearance at both ends, duty and tax handling, and destination delivery, the service helps customers prepare the information and handovers needed for each shipment. Eligible goods, the service scope and the cost breakdown are confirmed during quotation so both sides understand the requirements.

For a Morocco shipment, provide the goods description, packaging, package count, weight, volume, pickup location in China and receiving city in Morocco. The team can then discuss shipment preparation and delivery arrangements.`,
   fr:`Le 25 août 2021, Barsan a lancé son service de fret DDP entre la Chine et le Maroc, réunissant dédouanement, traitement des droits et taxes et livraison pour les exportateurs chinois.

## Un service tourné vers le Maroc

La prestation se concentre sur la livraison au Maroc et relie la préparation à l'exportation en Chine aux formalités et à la distribution à destination. Les clients peuvent coordonner les étapes selon leurs marchandises, le lieu de réception et leur programme d'expédition.

## Coordonner douane, taxes et livraison

La coordination du dédouanement aux deux extrémités, des droits et taxes et de la livraison aide à préparer les informations et les transmissions nécessaires. Les marchandises acceptées, les prestations et la composition du prix sont précisées au devis afin de définir les exigences de chaque envoi.

Pour une demande vers le Maroc, indiquez la nature et l'emballage des marchandises, le nombre de colis, le poids, le volume, le lieu d'enlèvement en Chine et la ville de réception au Maroc. L'équipe pourra préparer avec vous les modalités de départ et de livraison.`,
   ary:`نهار 25 غشت 2021، بارسان طلقت خط الشحن من الصين للمغرب بخدمة DDP، اللي كتجمع تنسيق التخليص الجمركي، تدبير الرسوم والضرائب والتوصيل للمصدّرين من الصين.

## خدمة مركزة على الشحن للمغرب

الخط كيركز على التسليم فالمغرب، وكيربط تحضير التصدير فالصين بالتخليص والتوصيل فالوجهة. الزبون يقدر ينسق المراحل على حساب نوع السلعة، بلاصة التسليم وبرنامج الإرسال.

## الربط بين الديوانة والرسوم والتوصيل

تنسيق التخليص فالطرفين، الرسوم والضرائب والتوصيل كيساعد على تحضير المعلومات وترتيبات تسليم السلعة بين المراحل. السلع المقبولة، نطاق الخدمة وتفاصيل الثمن كيتأكدو فالعرض، باش تكون متطلبات كل شحنة واضحة.

باش تسول على الشحن للمغرب، عطينا نوع السلعة، التغليف، عدد الطرود، الوزن، الحجم، بلاصة الاستلام فالصين ومدينة التسليم فالمغرب. الفريق كيراجع معاك تحضير الشحنة وترتيبات التوصيل.`
  }
 }
].map(article=>({...article,category:'company',status:'published',demo:false,bodyFormat:{en:'text',fr:'text',ary:'text',zh:'text'},contentVersion:COMPANY_NEWS_VERSION}));

export function addCompanyNews(db){
 if(db.prepare('SELECT id FROM migrations WHERE id=?').get(COMPANY_NEWS_VERSION))return;
 db.exec('BEGIN IMMEDIATE');
 try{
  const insert=db.prepare('INSERT INTO articles (id,slug,value) VALUES(?,?,?)');
  for(const article of companyNews){
   if(db.prepare('SELECT id FROM articles WHERE slug=?').get(article.slug))continue;
   const id=randomUUID();insert.run(id,article.slug,JSON.stringify({...structuredClone(article),id}));
  }
  db.prepare('INSERT INTO migrations VALUES(?)').run(COMPANY_NEWS_VERSION);
  db.exec('COMMIT');
 }catch(error){db.exec('ROLLBACK');throw error;}
}
