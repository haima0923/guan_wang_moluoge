const articles = [
  {
    slug: 'china-morocco-sea-freight-transit-time',
    photo: {"zh": "侧面驶过海岸的集装箱船", "en": "Container ship sailing past the coast", "fr": "Porte-conteneurs longeant la côte", "ary": "باخرة ديال الكونطونيرات حدا الساحل"},
    links: [['Maersk · Shipping terms', 'https://www.maersk.com/support/glossaries/shipping-terms']],
    zh: {
      title: '中国到摩洛哥海运要多久？先看懂船期上的三个时间',
      excerpt: '预计开船、预计到港和预计送达是三个不同的时间。会看船期，才能把订舱和摩洛哥收货安排放在同一张日历上。',
      share: '货代给了一个到港日期，你哪天才能收到货？这篇把开船、到港、中转和最终送达讲清楚，方便提前排仓库和库存。',
      sections: [
        ['从货好日期往后排', '比如货在广州工厂备好，你需要依次确认提货或送仓、装箱进港、开船、到港、放行和派送。问「海运多少天」时，先约定从哪里开始、在哪里结束。港到港时间通常从起运港开船算到目的港到达，与你的工厂到仓库计划是两个口径。'],
        ['ETD、ETA 和送达日分别看', 'ETD 是预计离港时间，ETA 是预计到达时间。到港后，还可能要等卸船、货物可提、海关和承运人放行，再安排卡车。给摩洛哥仓库约车时，问当地代理预计可提货时间，并把最终送达作为单独一项确认。'],
        ['直航和中转，比较同一段路', '拿两份方案时，先对齐起运港和目的港。再问途中是否换船、在哪转、衔接错过后怎么处理。某个方案即使纸面航程短，也可能因为班次、截港或中转等待更晚送达。做补货计划时，围绕交付窗口留出余量。'],
        ['什么时候再确认', '订舱前核对预计船期；交货前再核对截货节点；开船后追踪实际离港和最新 ETA；临近到港时让当地代理更新可提时间。有交付期限的订单，要把最晚可收货日提前告诉货代。']
      ],
      message: '货物预计［日期］在［义乌／广州等］备好，送到［摩洛哥城市］，最晚［日期］要收货。请发起运港、目的港、ETD、ETA、是否中转，以及预计可提货或到门的时间。'
    },
    en: {
      title: 'How long does sea freight from China to Morocco take? Three dates to check',
      excerpt: 'Estimated departure, port arrival and final delivery are different milestones. Use all three to plan your booking and receiving dates.',
      share: 'An arrival date on the schedule is only part of your plan. Here is how to check departure, transshipment and final delivery before booking.',
      sections: [
        ['Start with the cargo-ready date', 'For cargo ready at a factory in Guangzhou, put collection or warehouse delivery, container loading, gate-in, sailing, arrival, release and local delivery on one timeline. Ask where the quoted transit time begins and ends. Port-to-port timing usually runs from departure to arrival and covers a shorter part of the journey than factory to warehouse.'],
        ['Read ETD, ETA and delivery separately', 'ETD is the estimated time of departure. ETA is the estimated time of arrival. After arrival, allow for discharge, cargo availability, customs and carrier release, and the truck appointment. Ask the local agent when collection is expected before you reserve a receiving slot.'],
        ['Compare direct and transshipment options on the same basis', 'Match the origin and destination ports first. Then ask whether the cargo changes vessels, where it connects and what happens if the connection is missed. A shorter scheduled sailing can still mean a later delivery if the cutoffs, sailing frequency or connections differ. Plan stock around the delivery window.'],
        ['Confirm the schedule again at each handover', 'Check the schedule before booking and the cutoff before handing over cargo. Once it sails, follow actual departure and the updated ETA. Near arrival, ask the local agent for the latest availability. Share your last acceptable delivery date before booking.']
      ],
      message: 'Our cargo will be ready in [Chinese city] on [date]. It goes to [Moroccan city] and must be received by [date]. Please confirm the origin and destination ports, ETD, ETA, any transshipment and estimated pickup or door delivery.'
    },
    fr: {
      title: 'Chine–Maroc par mer : trois dates à vérifier avant de réserver',
      excerpt: 'Le départ prévu, l’arrivée au port et la livraison finale sont trois étapes différentes. Voici comment les intégrer à votre planning.',
      share: 'Votre transitaire annonce une date d’arrivée au port. Quand la marchandise sera-t-elle réellement disponible ? Voici les étapes à vérifier avant de réserver.',
      sections: [
        ['Partez de la date de disponibilité', 'Pour une marchandise prête chez un fournisseur à Guangzhou, placez sur le même calendrier la collecte ou la remise à l’entrepôt, le chargement, l’entrée au terminal, le départ, l’arrivée, la mainlevée et la livraison. Demandez à partir de quel point le délai est calculé. Le délai de port à port couvre généralement la période entre le départ et l’arrivée du navire.'],
        ['Distinguez ETD, ETA et date de livraison', 'ETD indique le départ estimé, ETA l’arrivée estimée. À l’arrivée, il peut rester le déchargement, la mise à disposition, la mainlevée douanière et l’autorisation du transporteur avant de programmer le camion. Demandez à l’agent local une date de retrait estimée avant de réserver un créneau de réception.'],
        ['Comparez les itinéraires sur le même périmètre', 'Alignez d’abord les ports de départ et d’arrivée. Demandez ensuite si un changement de navire est prévu, dans quel port et comment sera gérée une correspondance manquée. Une traversée annoncée plus courte peut déboucher sur une livraison plus tardive selon les dates limites, la fréquence des départs et l’attente au transbordement.'],
        ['Actualisez votre planning en cours de route', 'Vérifiez le départ prévu avant la réservation, puis l’heure limite avant la remise de la marchandise. Après le départ, suivez l’heure réelle de départ et la nouvelle ETA. À l’approche de l’arrivée, demandez à l’agent local quand le retrait sera possible. Communiquez dès le départ votre dernière date de réception acceptable.']
      ],
      message: 'La marchandise sera prête à [ville en Chine] le [date], pour [ville au Maroc], avec réception au plus tard le [date]. Merci de préciser les ports, l’ETD, l’ETA, le transbordement éventuel et le délai estimé de retrait ou de livraison.'
    },
    ary: {
      title: 'شحال كياخد الشحن من الصين للمغرب بالبحر؟ ثلاثة تواريخ خاصك تعرفهم',
      excerpt: 'الوقت المتوقع ديال الخروج، الوصول للميناء، والتوصيل النهائي كل واحد عندو حسابو. هكا ترتب وقت الشحن والاستلام.',
      share: 'قالو لك الباخرة غادي توصل فنهار معيّن. واش غادي تاخد السلعة فنفس النهار؟ شوف شنو خاصك تسول عليه قبل الحجز.',
      sections: [
        ['بدا من النهار اللي غادي توجد فيه السلعة', 'إلا كانت السلعة غادي توجد عند المورّد فگوانزو، كتب فجدول واحد وقت الجمع أو التسليم للمخزن، التحميل، الدخول للميناء، الخروج، الوصول، الإفراج والتوصيل. سول منين لفين محسوب الوقت. حساب من ميناء لميناء كيبدا عادة مع خروج الباخرة وكيسالي مع الوصول ديالها.'],
        ['فرّق بين ETD وETA ونهار التوصيل', 'ETD هو وقت الخروج المتوقع وETA هو وقت الوصول المتوقع. من بعد الوصول كاين التفريغ، ووقت الجاهزية للسحب، والترخيص من الديوانة وشركة الشحن، قبل ما تحدد موعد الكاميو. سول الوكيل المحلي إمتى متوقع السلعة تولّي قابلة للسحب، قبل ما تحجز موعد الاستلام.'],
        ['قارن الطريق المباشر والترانزيت بنفس الطريقة', 'أكد باللول ميناء الخروج وميناء الوصول. سول واش غادي تبدل الباخرة، فين، وشنو كيدار إلا فات الربط. حتى إلا كان وقت البحر أقصر فالعرض، التسليم يقدر يتأخر على حساب مواعيد الإغلاق وعدد الرحلات والانتظار فالترانزيت. خلي شوية هامش فبرنامج الاستلام.'],
        ['عاود أكد البرنامج فكل مرحلة', 'راجع الرحلة قبل الحجز وآخر وقت للتسليم قبل ما تصيفط السلعة. من بعد الخروج، تبّع تاريخ الخروج الفعلي وETA الجديدة. ملي تقرّب الباخرة توصل، سول الوكيل المحلي على موعد السحب. قول للترانزيتير من اللول آخر نهار ممكن تستلم فيه.']
      ],
      message: 'السلعة غادي توجد فـ[المدينة فالصين] نهار [التاريخ] وغادية لـ[المدينة فالمغرب]. خاصني نستلم قبل [التاريخ]. عفاك أكد الموانئ، ETD وETA، واش كاين ترانزيت، وإمتى متوقع السحب أو التوصيل.'
    }
  },
  {
    slug: 'sea-freight-booking-cutoffs-si-vgm',
    photo: {"zh": "港区集装箱与吊机", "en": "Containers and cranes at a port", "fr": "Conteneurs et grues portuaires", "ary": "كونطونيرات ورافعات فالميناء"},
    links: [
      ['IMO · Verified gross mass of a packed container', 'https://www.imo.org/en/ourwork/safety/pages/verification-of-the-gross-mass.aspx'],
      ['Maersk · Shipping terms', 'https://www.maersk.com/support/glossaries/shipping-terms']
    ],
    zh: {
      title: '海运订舱后，截单、截重、截港分别是什么？',
      excerpt: '拿到订舱确认后，把三个截止时间分开记。拼箱货还要确认集货仓的收货时间和交货地址。',
      share: '订到舱还要盯三个截止点。转给供应商和仓库一起核对，避免货到港了，资料却没赶上。',
      sections: [
        ['截单：发提单资料的最后时间', 'SI 是制作运输单证所用的装运指示。把发货人、收货人、货描、件数和重量等资料给负责提交的人，并预留核对提单草稿的时间。信息还在变时，先问修改窗口和可能的费用。'],
        ['截重：提交 VGM 的最后时间', 'VGM 是装货后集装箱的核实总重，包含货物、包装、加固材料和柜体重量。按照 IMO 的规则，运输单证上列明的托运人负责提供核实总重，船舶和码头需要及时取得该数据以用于配载。先确认谁负责称重、提交和核对回执。'],
        ['截港：重柜进指定码头的最后时间', '先核对实际码头、进场预约、箱号和当地日期时间。算上提空柜、装柜和路上时间。拼箱通常先按货代或仓库的收货截止时间交货，整柜相关的提交由负责拼装出运的一方协调，交货前问清自己的节点。'],
        ['三个时间写在同一条消息里', '把每项责任人、截止时间、时区、提交状态记在一起。遇到工厂延期或车队来不及进场，马上让货代确认能否补交、改订哪个船期，以及是否产生额外费用。']
      ],
      message: '请发这票货的最新截单、截 VGM、截港或截仓时间（含当地时区），并确认由谁提交 SI 和 VGM、送到哪个码头或仓库、误截后怎么处理。'
    },
    en: {
      title: 'Booked your sea freight? Check the SI, VGM and terminal cutoffs',
      excerpt: 'Track the documentation, verified weight and terminal deadlines separately. For LCL, also confirm the receiving warehouse deadline and address.',
      share: 'A booking has several deadlines. Share this checklist with your supplier and warehouse so the cargo and its documents are ready for the same sailing.',
      sections: [
        ['SI cutoff: submit the shipping instructions', 'Shipping instructions supply the details used to prepare the transport document. Send the responsible party the shipper, consignee, cargo description, piece count and weight. Leave time to review the draft. If details may change, ask about the amendment deadline and any charge.'],
        ['VGM cutoff: submit the verified packed container weight', 'Verified gross mass includes the cargo, packing, securing material and container tare. Under the IMO rules, the shipper named on the transport document is responsible for providing the VGM in time for the terminal and vessel to use it in stowage planning. Confirm who arranges weighing, submission and acknowledgment.'],
        ['Gate-in cutoff: deliver the loaded container to the terminal', 'Check the terminal, gate appointment, container number, local date and time. Allow time to pick up the empty container, load it and drive to the terminal. For LCL, the customer usually delivers cargo by the warehouse receiving deadline. Ask who coordinates the container-level steps for the consolidated shipment.'],
        ['Confirm responsibilities as well as times', 'List the owner, deadline, time zone and submission status for each task. If a factory delay or trucking issue puts a deadline at risk, ask immediately whether late submission is possible, which alternative sailing is available and what it would cost.']
      ],
      message: 'Please confirm the latest local SI, VGM and gate-in or warehouse cutoff times. Who submits SI and VGM, where do we hand over the shipment, and what happens if we miss a deadline?'
    },
    fr: {
      title: 'Réservation maritime : quelles dates limites pour les SI, la VGM et le terminal ?',
      excerpt: 'Vérifiez séparément les délais des instructions, de la masse vérifiée et de l’entrée au terminal. En groupage, confirmez la date limite de l’entrepôt.',
      share: 'Votre réservation est confirmée ? Vérifiez ces trois heures limites avec votre fournisseur et votre entrepôt pour préparer le départ.',
      sections: [
        ['Instructions d’expédition : l’heure limite de remise des SI', 'Les SI fournissent les données nécessaires à l’établissement du document de transport. Transmettez à la personne chargée du dépôt le nom du chargeur et du destinataire, la description des marchandises, le nombre de colis et le poids. Gardez du temps pour relire le projet. Demandez le délai de modification et les frais éventuels si les données peuvent changer.'],
        ['Masse brute vérifiée : l’heure limite de déclaration de la VGM', 'La VGM comprend la marchandise, son emballage, le matériel de calage et la tare du conteneur. Selon les règles de l’OMI, le chargeur mentionné sur le document de transport doit communiquer la VGM à temps pour la préparation du plan de chargement par le terminal et le navire. Confirmez qui pèse, qui déclare et qui vérifie l’accusé de réception.'],
        ['Entrée au terminal : la date limite du conteneur chargé', 'Vérifiez le terminal exact, le rendez-vous, le numéro de conteneur, la date et l’heure locales. Prévoyez du temps pour l’enlèvement du vide, l’empotage et le trajet. En groupage, vous remettez généralement vos colis avant la fermeture de la réception de l’entrepôt. Demandez qui coordonne les étapes du conteneur groupé.'],
        ['Répartissez les tâches avant de remettre la marchandise', 'Notez le responsable, l’échéance, le fuseau et le statut pour chaque tâche. En cas de retard de production ou de transport, demandez à temps si un dépôt tardif est possible, quel autre départ est disponible et quels frais peuvent s’ajouter.']
      ],
      message: 'Merci de préciser les dernières échéances locales pour les SI, la VGM et l’entrée au terminal ou la réception à l’entrepôt. Qui dépose chaque élément, où faut-il livrer et que faire si une échéance est dépassée ?'
    },
    ary: {
      title: 'حجزتي الشحن البحري؟ شوف آخر وقت ديال SI وVGM والدخول للميناء',
      excerpt: 'تعليمات الشحن والوزن المؤكد ودخول الكونطونير عندهم مواعيد مختلفة. فالشحن المجمّع، أكد حتى وقت التسليم للمخزن.',
      share: 'الحجز تأكد؟ صيفط هاد اللائحة للمورّد والمخزن باش السلعة والوراق يلحقو لنفس الرحلة.',
      sections: [
        ['SI: آخر وقت باش تصيفط معلومات الشحن', 'SI هي المعلومات اللي كيتوجد بها سند النقل. عطِ للي غادي يقدّمها سمية المرسل والمتسلّم، وصف السلعة، عدد الطرود والوزن. خلي الوقت باش تراجع المسودة. إلا كانت المعلومات تقدر تتبدل، سول على آخر وقت للتصحيح والمصاريف المحتملة.'],
        ['VGM: آخر وقت للتصريح بالوزن الإجمالي المؤكّد', 'VGM كيشمل السلعة والتغليف ومواد التثبيت ووزن الكونطونير خاوي. حسب قواعد المنظمة البحرية الدولية، الطرف المبيّن فوثيقة النقل بصفة الشاحن مسؤول على تقديم الوزن المؤكّد فالوقت باش الميناء والباخرة يستعملوه فترتيب التحميل. أكد شكون غادي يوزن، يصيفط ويتأكد من التوصل.'],
        ['دخول الكونطونير عامر للميناء', 'أكد الترمينال والموعد ورقم الكونطونير والساعة المحلية. حسب وقت جبد الكونطونير خاوي، التحميل والطريق. فالشحن المجمّع غالباً كتسلم الكراتين للمخزن قبل آخر موعد ديال الاستلام. سول شكون كينسق الإجراءات اللي كتخص الكونطونير المجمّع.'],
        ['قسم الخدمة قبل التسليم', 'كتب شكون مسؤول على كل خطوة ووقتاش خاصها تسالي، وبأي توقيت، وواش تدارَت. إلا تأخر المصنع ولا الكاميو، سول بكري واش ممكن التسليم متأخر، شنو أقرب رحلة أخرى، وشنو المصاريف المحتملة.']
      ],
      message: 'عفاك صيفط آخر موعد بتوقيت محلي لـSI وVGM ولدخول الميناء أو التسليم للمخزن. شكون كيقدّم كل وثيقة، فين نسلمو السلعة، وشنو نديرو إلا فاتنا شي موعد؟'
    }
  },
  {
    slug: 'ocean-bill-of-lading-and-cargo-release',
    photo: {"zh": "桌旁核对纸质资料", "en": "People checking paperwork at a table", "fr": "Vérification de documents sur une table", "ary": "مراجعة الوراق فوق الطابلة"},
    links: [
      ['Maersk · Bill of lading and sea waybill', 'https://www.maersk.com/logistics-explained/shipping-documentation/2023/10/03/difference-bill-of-lading-sea-waybill'],
      ['Maersk · Cargo release procedures', 'https://www.maersk.com/insights/digitalisation/2024/10/09/cargo-release']
    ],
    zh: {
      title: '正本提单、电放、海运单怎么选？先把放货方式说清楚',
      excerpt: '同样是海运，到港交单和放货条件可能不同。订舱前核对付款条款、收货人和目的港放货流程。',
      share: '收到提单 PDF，就能在摩洛哥提货吗？发给负责付款和收货的同事，一起核对这几项。',
      sections: [
        ['先分清单证和放货方式', '如果走正本提单，问清在约定流程中谁持有正本、哪里交单、需要怎样背书。电放通常指按承运人或出单方流程交回正本或办理相应手续后，由起运端通知目的端放货。扫描件可以用来核对资料，放货是否完成要向出单方确认。'],
        ['海运单适合什么情况', '海运单（Sea Waybill）通常不可转让，目的端按出单方的规则向单上指定收货人交付，通常不要求出示纸质正本。选用前，先确认买卖合同、付款安排和目的端是否接受。走信用证时，把单证要求交给银行和出单方一起核对。'],
        ['提单草稿到手，先核对这几处', '核对发货人、收货人和通知方的名称及联系方式，检查货描、件数、重量、起运港和目的港。若同时有货代提单与船公司提单，问清收货人跟谁办理、凭哪一份、谁能确认放货状态。'],
        ['到港前，分别确认承运人和海关放行', '让摩洛哥代理说明目的端需要的授权或身份资料、费用与付款状态以及取货方式。运输单证放货和海关放行是不同环节，安排卡车前逐项确认。']
      ],
      message: '这票货的付款方式是［方式］，收货人是［公司全称］。请确认适用的单证、出单方、放货所需手续、目的港联系人，以及我在哪里查看放货状态。'
    },
    en: {
      title: 'Original bill of lading, telex release or sea waybill? Plan cargo release first',
      excerpt: 'Check the payment terms, consignee and destination release procedure before booking. Different documents can require different handover steps.',
      share: 'Does an emailed bill of lading PDF mean your cargo can be collected? Share these checks with the people paying for and receiving the shipment.',
      sections: [
        ['Separate the document from the release procedure', 'For an original bill of lading, confirm who holds the originals and where and how they must be presented or endorsed. With telex release, the origin side normally completes the surrender or equivalent issuer procedure and tells the destination side to release the cargo. Use a scan to check the details and ask the issuer to confirm the release status.'],
        ['Check when a sea waybill fits', 'A sea waybill is generally non-negotiable. The issuer normally delivers to the named consignee under its identity and release procedures without requiring a paper original. Check the sales contract, payment terms and destination acceptance. For a letter of credit, review the document requirements with the bank and issuer.'],
        ['Check the draft before it is issued', 'Check the names and contact details of the shipper, consignee and notify party, and verify the cargo description, package count, weight and ports. If there is both a forwarder’s house bill and a carrier’s master bill, ask which document applies to your collection and who can confirm release.'],
        ['Confirm carrier and customs release before arrival', 'Ask the Moroccan agent what authorizations or identification are required, what charges and payments remain, and how pickup is arranged. Document-based cargo release and customs clearance are separate steps. Confirm the status of both before dispatching the truck.']
      ],
      message: 'Our payment terms are [terms] and the consignee is [full company name]. Please confirm the appropriate document, its issuer, the steps for release, the destination contact and where we can check the release status.'
    },
    fr: {
      title: 'Connaissement original, telex release ou sea waybill : préparez la remise de la marchandise',
      excerpt: 'Avant de réserver, vérifiez les conditions de paiement, le destinataire et les formalités de remise au port d’arrivée.',
      share: 'Un PDF du connaissement suffit-il pour retirer la marchandise au Maroc ? Voici les vérifications à partager avec les équipes paiement et réception.',
      sections: [
        ['Distinguez le document de la procédure de remise', 'Avec un connaissement original, confirmez qui détient les originaux, où les présenter et dans quelles conditions les endosser. Pour un telex release, le port de départ confirme généralement au port d’arrivée que les originaux ont été remis ou que la procédure de l’émetteur a été effectuée. Une copie scannée sert à vérifier les données. Confirmez la remise auprès de l’émetteur.'],
        ['Vérifiez si une lettre de transport maritime convient', 'La lettre de transport maritime ou sea waybill est en principe non négociable. La livraison se fait au destinataire désigné selon les contrôles de l’émetteur, généralement sans présentation d’un original papier. Vérifiez le contrat, le paiement et l’acceptation à destination. En cas de crédit documentaire, vérifiez les exigences avec la banque et l’émetteur.'],
        ['Relisez le projet de connaissement', 'Vérifiez le chargeur, le destinataire et la partie à notifier, leurs coordonnées, la description du fret, le nombre de colis, le poids et les ports. S’il existe à la fois un connaissement du transitaire et un document du transporteur, demandez lequel utiliser pour le retrait et qui confirme l’autorisation.'],
        ['Vérifiez séparément le transporteur et la douane', 'Demandez à l’agent au Maroc quelles autorisations ou pièces d’identité présenter, quels frais ou paiements restent à régler et comment organiser le retrait. L’autorisation du transporteur et la mainlevée douanière sont deux étapes distinctes à vérifier avant d’envoyer le camion.']
      ],
      message: 'Le paiement est prévu selon [modalités] et le destinataire est [raison sociale complète]. Merci de confirmer le document, son émetteur, les démarches pour la remise, le contact à destination et le suivi de l’autorisation.'
    },
    ary: {
      title: 'بوليصة أصلية ولا Telex Release ولا Sea Waybill؟ اتافق على طريقة التسليم من اللول',
      excerpt: 'قبل الحجز، تأكد من طريقة الخلاص واسم المتسلّم والإجراءات اللي كيطلبها الوكيل فميناء الوصول.',
      share: 'واش نسخة PDF ديال البوليصة كافية باش تسحب السلعة؟ شارك هاد النقاط مع اللي كيخلّص واللي غادي يستلم.',
      sections: [
        ['فرّق بين البوليصة وطريقة الإفراج', 'إلا خدمتي بالبوليصة الأصلية، سول شكون غادي يحتافظ بالأصل، فين خاصو يتسلّم وكيفاش يكون التظهير إلا كان مطلوب. فـTelex Release، جهة الشحن كتكمّل تسليم الأصول أو الإجراء المطلوب عند الجهة اللي خرجات الوثيقة وكتعلّم الوكيل فالوصول. استعمل النسخة باش تراجع البيانات وأكد حالة الإفراج مع مُصدر الوثيقة.'],
        ['إمتى تصلح Sea Waybill؟', 'هاد الوثيقة عادة ما كتتنقلش من طرف لطرف. السلعة كتتسلّم للمتسلّم المسمّى فيها حسب التحقق ديال الجهة اللي خرجاتها، غالباً بلا أصل ورقي. راجع العقد وطريقة الخلاص والقبول فالوصول. إلا كان اعتماد مستندي، راجع الوثائق مع البنك والجهة اللي غادي تصدرها.'],
        ['راجع المسودة قبل الإصدار', 'أكد الأسماء والأرقام ديال المرسل والمتسلّم والطرف اللي خاصو يتبلّغ. راجع وصف السلعة وعدد الطرود والوزن والموانئ. إلا كان سند ديال الترانزيتير وسند ديال شركة الشحن، سول بأي واحد غادي تسحب وشكون كيأكد الترخيص.'],
        ['أكد وضعية شركة الشحن والديوانة كل وحدة بوحدها', 'سول الوكيل فالمغرب على الترخيص والهوية والمصاريف اللي باقي خاصها تتخلّص وكيفاش تبرمج السحب. الموافقة ديال شركة الشحن والإفراج ديال الديوانة جوج مراحل. تأكد من بجوج قبل ما تصيفط الكاميو.']
      ],
      message: 'طريقة الخلاص ديالنا هي [الطريقة] والمتسلّم هو [الاسم الكامل ديال الشركة]. عفاك أكد الوثيقة وشكون كيصدرها وكيفاش نديرو الإفراج وشكون نتاصلو به فالوصول وفين نتبعو الحالة.'
    }
  },
  {
    slug: 'morocco-ocean-container-free-time',
    photo: {"zh": "公路上的集装箱卡车", "en": "Truck carrying a container on a road", "fr": "Camion transportant un conteneur sur la route", "ary": "كاميو هاز كونطونير فالطريق"},
    links: [
      ['Maersk · Detention and demurrage', 'https://www.maersk.com/support/faqs/detention-and-demurrage'],
      ['Maersk · Morocco import information', 'https://www.maersk.com/fr-fr/local-information/europe/morocco/import']
    ],
    zh: {
      title: '海运整柜到摩洛哥，怎样安排提柜和还柜？',
      excerpt: '从到港通知到指定地点还空柜，把免费期、预约和费用分别确认。附一份可以直接发给代理的提还柜问题清单。',
      share: '收到到港通知后，记得问两个日期：最晚何时提柜、最晚何时还空柜。这篇也讲了怎么算免费期、留哪些凭证。',
      sections: [
        ['先问清免费期对应哪个环节', '有的运单把箱子留在码头和提走后继续占用分别计时，有的采用合并免费期。通常说的 demurrage 和 detention 分别涉及柜在码头内与提离后使用超期，实际口径看该票条款。码头仓储费也可能由码头另行收取，分别问清计费方和规则。'],
        ['要具体日期，不只问「几天免费」', '请当地代理写清起算事件、按自然日还是工作日计、是否分开计时、最后免费提柜日和最晚还空柜日。不要凭预计到港日自己推算。临近摩洛哥节假日，提前确认车队、收货点和还柜场的营业窗口。'],
        ['按交接倒排：放行、提、卸、还', '提前确认海关与承运人的放行状态、码头提柜预约、收货地点能否卸柜、空柜应还到哪个场站以及接受时间。还柜点有变更时，请代理或承运人书面确认。保留出闸和还柜交接凭证及时间。'],
        ['某一步卡住时，先弄清谁能处理', '例如柜已在码头但收货点还不能卸，问能否调整预约、是否有可购买的免费期或其他安排，并要求确认新增费用。拼箱的提货和仓储规则可能不同，应向目的端拆箱仓另问最后免费提货日。']
      ],
      message: '提单号或箱号［号码］，目的港［港名］。请确认当前放行状态、分开或合并免费期及起算点、最后免费提柜和还柜日期、指定还柜场、超期计费及需要保留的凭证。'
    },
    en: {
      title: 'Your full container has arrived in Morocco. When should you collect and return it?',
      excerpt: 'Confirm free time, appointments and charges from arrival notice to empty return. Includes a message you can send to your local agent.',
      share: 'Ask for specific pickup and empty return dates. Here is how to check which free-time rules apply and what records to keep.',
      sections: [
        ['Check which stage each free period covers', 'Some bookings use separate clocks for keeping a container in the terminal and using it after gate-out. Others use a combined free period. Demurrage and detention usually refer to those two stages respectively, but apply the terms for your booking. Terminal storage may be charged separately, so ask who invoices it and on what basis.'],
        ['Ask for calendar dates as well as the number of days', 'Have the local agent confirm the event that starts the clock, whether it counts calendar or working days, whether the periods are separate, and the dates for last free pickup and empty return. Use the confirmed dates for the shipment. Around Moroccan holidays, confirm opening hours with the trucker, receiver and return depot.'],
        ['Work back from empty return', 'Confirm customs and carrier release, terminal pickup appointment, unloading capacity at the delivery site and the depot and time window for empty return. Obtain written confirmation of a depot change and keep the gate-out and return interchange receipts and timestamps.'],
        ['Act early if a step is blocked', 'If the container is in the terminal and the receiver is not ready, ask about changing the appointment, securing extra free time or another available arrangement and confirm any charges. For LCL, ask the destination warehouse for its own free collection date.']
      ],
      message: 'Bill or container [number], destination [port]. Please give the release status, free-time start event and rules, last free pickup and empty return dates, return depot, applicable late charges and the receipts we should keep.'
    },
    fr: {
      title: 'Conteneur maritime arrivé au Maroc : quand le retirer et quand restituer le vide ?',
      excerpt: 'De l’avis d’arrivée à la restitution du vide, vérifiez les franchises, les rendez-vous et les frais. Un message prêt à envoyer à votre agent est inclus.',
      share: 'Deux dates à retenir après l’avis d’arrivée : le dernier jour pour retirer le conteneur et celui pour restituer le vide. Voici comment les vérifier.',
      sections: [
        ['Identifiez ce que couvre chaque franchise', 'Selon la réservation, le séjour au terminal et l’utilisation du conteneur après sa sortie ont des délais séparés ou une franchise combinée. Les termes demurrage et detention concernent généralement ces deux étapes, selon les conditions de votre dossier. Le stockage terminal peut être facturé séparément. Demandez qui le facture et sur quelle base.'],
        ['Demandez des dates précises', 'Faites confirmer par l’agent local l’événement qui déclenche le compteur, le décompte en jours calendaires ou ouvrés, et les dates limites de retrait et de retour du vide. Utilisez les dates confirmées pour votre dossier. À l’approche des jours fériés au Maroc, vérifiez les créneaux avec le transporteur, le réceptionnaire et le dépôt.'],
        ['Remontez le planning depuis le retour du vide', 'Vérifiez l’autorisation du transporteur, la mainlevée douanière, le créneau au terminal, la capacité de déchargement et le lieu et l’horaire de restitution. Faites valider par écrit tout changement de dépôt. Conservez les bons d’échange et les heures de sortie et de retour.'],
        ['Réagissez dès qu’une étape bloque', 'Si le conteneur est au terminal et que le site de livraison ne peut pas décharger, demandez si le créneau peut être déplacé, si une franchise supplémentaire est disponible et combien elle coûte. En groupage, demandez à l’entrepôt de destination la date limite de retrait sans frais.']
      ],
      message: 'Connaissement ou conteneur [numéro], port [nom]. Merci de préciser les autorisations, le début et le mode de calcul des franchises, les dates limites de retrait et de restitution, le dépôt, les frais de dépassement et les justificatifs à garder.'
    },
    ary: {
      title: 'الكونطونير وصل للمغرب: فوقاش تسحبو وفوقاش ترجعو خاوي؟',
      excerpt: 'من إشعار الوصول حتى ترجيع الكونطونير، أكد مدة السماح والمواعيد والمصاريف مع الوكيل المحلي.',
      share: 'ملي توصلك ورقة الوصول، سول على آخر نهار للسحب وآخر نهار باش ترجع الكونطونير خاوي. هنا شنو تأكد وشنو تحتافظ به.',
      sections: [
        ['عرف كل مدة سماح فين كتنطبق', 'شي حجوزات كيحسبو وقت بقاء الكونطونير فالترمينال ووقت الاستعمال من بعد الخروج كل واحد بوحدو، وشي حجوزات كيجمعوهم. Demurrage وdetention غالباً كيتعلقو بهاد الجوج مراحل حسب شروط الشحنة. المخزن فالترمينال يقدر يتحسب بوحدو. سول شكون كيحسبو وكيفاش.'],
        ['سول على التاريخ بالضبط', 'خلّي الوكيل يكتب إمتى كيبدا الحساب، واش بالأيام العادية ولا أيام الخدمة، واش المدد مجموعة، وآخر تاريخ للسحب وترجيع الخاوي بلا مصاريف التأخير. خدم بالتواريخ المؤكدة ديال شحنتك. حدا العطل فالمغرب سول على أوقات الخدمة ديال الكاميو والاستلام والمستودع.'],
        ['رتّب الخدمة من موعد الترجيع للور', 'أكد الإفراج من الديوانة وشركة الشحن، موعد الدخول للسحب، واش بلاصة التسليم واجدة للتفريغ، وفين وفوقاش يقبلو الكونطونير خاوي. إلا تبدلات بلاصة الترجيع، خذ التأكيد مكتوب وخلي عندك وصولات الخروج والترجيع مع الوقت.'],
        ['إلا تعطلات خطوة، تصرف بكري', 'إلا الكونطونير فالترمينال وبلاصة الاستلام مازال ما واجداش، سول واش ممكن تبدل الموعد، تزيد مدة السماح إلى كانت متاحة، وشحال غادي تخلص. فالشحن المجمّع، سول مخزن الوصول على آخر نهار تقدر تسحب فيه بلا مصاريف إضافية.']
      ],
      message: 'رقم البوليصة أو الكونطونير [الرقم] وميناء الوصول [الميناء]. عفاك أكد الإفراج، بداية وكيفاش كيتحسب وقت السماح، آخر نهار للسحب ولترجيع الخاوي، المستودع، مصاريف التأخير والوصولات اللي نخليو.'
    }
  },
  {
    slug: 'ocean-freight-packaging-moisture-checklist',
    photo: {"zh": "仓库装卸口前的待发纸箱", "en": "Cartons awaiting shipment at a loading bay", "fr": "Cartons en attente devant un quai de chargement", "ary": "كراتين قدّام باب التحميل فالمخزن"},
    links: [['UNECE · CTU Code: packing cargo transport units', 'https://unece.org/intermodal-transport/imoilounece-code-practice-packing-cargo-transport-units-ctu-code']],
    zh: {
      title: '海运到摩洛哥，纸箱怎样防潮、防压？装柜前检查这四项',
      excerpt: '海运途中温差会带来凝露，搬运和堆叠也会给外箱施压。从出厂包装、干燥检查到装载取证，收货前就能做准备。',
      share: '纸箱被压软或到货返潮，往往要从装运前找原因。把这份四步检查发给供应商和仓库，装柜前一起确认。',
      sections: [
        ['先把货物的弱点写清楚', '让供应商标明货物是否怕潮、易碎、不能倒置或不能叠放，以及内外包装、单箱毛重和外尺寸。易碎件要匹配缓冲和固定方式，重箱需要适合堆码载荷的纸箱或其他包装。只贴「易碎」标签解决不了箱内移动和外箱承重问题。'],
        ['潮气从哪里来，装之前先拦住', '温度变化时，箱内水汽可能在较冷的箱壁或箱顶凝结。纸箱、木料、托盘和货物自身都可能带入水分。装柜前查箱体是否干燥、有没有破损或进水痕迹，潮湿的货物和包装先处理。对怕潮货物，让供应商和装箱方按货物与航程选用防潮内衬或干燥剂，确认用量与摆放方式。'],
        ['让包装和装载一起考虑', '同柜货物要考虑堆叠、重心、支撑、缝隙和固定。不要让上层重量压在明显承受不了的外箱上。拼箱还要问清入仓包装要求和可否叠放，提前把限制告诉货代，不能在订舱后才临时补写。'],
        ['留一组能对得上的装运照片', '请仓库拍外箱状态与唛头、托盘或加固、装载和实际箱号；如你能取得封柜照片，再记下封条号。收货时先拍外箱、破损或水印和货物状态，留存原包装与单证，并尽快联系货代及适用的保险方核对通知要求。']
      ],
      message: '货物是［品名］，每箱［尺寸／毛重］，［怕潮／易碎／可否叠放］。请确认外箱与托盘要求、防潮与固定措施，并在装运前拍外箱、唛头和装载照片。'
    },
    en: {
      title: 'Shipping to Morocco by sea? Four packing checks for moisture and crushing',
      excerpt: 'Condensation, stacking and handling can damage cartons. Check the packaging, dryness, loading and condition records before the cargo leaves.',
      share: 'Share these four packing checks with your supplier and warehouse before loading: cargo limits, dryness, stacking and photos.',
      sections: [
        ['Write down what can damage the goods', 'Ask the supplier to record moisture sensitivity, fragility, orientation and stacking limits, plus inner and outer packaging, gross weight and outer dimensions per carton. Fragile items need suitable cushioning and restraint. Heavy cartons need packaging rated for the expected stacking load. A fragile label alone cannot keep the item from moving.'],
        ['Control moisture before loading', 'Temperature swings can cause damp air to condense on a colder container roof or wall. Goods, cartons and wooden pallets can all introduce moisture. Inspect the container for dryness, damage and signs of water entry. Address damp goods or packaging before loading. For sensitive cargo, agree on suitable liners or desiccants, including their placement and quantity, with the supplier and packer.'],
        ['Plan packing and loading together', 'Check stacking loads, weight distribution, support, gaps and restraint. Avoid putting heavy freight on cartons that cannot support it. For LCL, confirm the receiving warehouse’s packaging requirements and share any stacking restrictions before the booking is made.'],
        ['Keep photos that match the shipment', 'Ask for photos of carton condition and marks, pallets or bracing, the load and the container number. Record the seal number if sealing photos are available. On receipt, photograph packages, visible damage or water marks and the goods, keep the packaging and documents, and contact the forwarder and any insurer promptly about notification requirements.']
      ],
      message: 'Cargo: [product], [dimensions and gross weight per carton], [moisture and stacking limits]. Please confirm the cartons or pallets, moisture protection, restraint and which packing and loading photos you can provide.'
    },
    fr: {
      title: 'Chine–Maroc par mer : quatre vérifications pour protéger vos cartons',
      excerpt: 'Condensation, empilage et manutention peuvent abîmer les cartons. Vérifiez l’emballage, l’humidité, le chargement et les photos avant le départ.',
      share: 'Avant le chargement, partagez ces quatre vérifications avec votre fournisseur et l’entrepôt : fragilité, humidité, empilage et photos.',
      sections: [
        ['Notez les points sensibles de la marchandise', 'Demandez au fournisseur de préciser la sensibilité à l’humidité, la fragilité, le sens de manutention et les limites d’empilage, ainsi que l’emballage, le poids brut et les dimensions de chaque carton. Prévoyez un calage adapté pour les articles fragiles et un emballage capable de supporter la charge prévue pour les cartons lourds.'],
        ['Limitez l’humidité avant l’empotage', 'Avec les variations de température, la vapeur d’eau peut se condenser sur le toit ou les parois plus froides. La marchandise, les cartons et les palettes peuvent introduire de l’humidité. Vérifiez si le conteneur est sec, endommagé ou présente des traces d’infiltration. Traitez les colis et emballages humides avant chargement. Pour les produits sensibles, convenez avec le fournisseur et l’empoteur de la protection, de l’emplacement et de la quantité des absorbants éventuels.'],
        ['Pensez à l’emballage et au chargement ensemble', 'Vérifiez la charge d’empilage, la répartition du poids, les appuis, les vides et le calage. Évitez de placer des charges lourdes sur des cartons qui ne peuvent pas les supporter. En groupage, demandez les exigences de l’entrepôt et communiquez les limites d’empilage avant de réserver.'],
        ['Gardez des photos rattachées au dossier', 'Demandez des photos de l’état et des marques des cartons, des palettes ou du calage, du chargement et du numéro de conteneur. Si vous avez une photo du scellé, relevez son numéro. À réception, photographiez les colis, les dégâts ou traces d’eau et la marchandise. Gardez emballages et documents et vérifiez rapidement les modalités de notification auprès du transitaire et de l’assureur concerné.']
      ],
      message: 'Marchandise [produit], [dimensions et poids brut par carton], [limites d’humidité et d’empilage]. Merci de confirmer les cartons ou palettes, la protection contre l’humidité, le calage et les photos disponibles avant départ.'
    },
    ary: {
      title: 'الشحن بالبحر للمغرب: أربعة حوايج تراجعها باش تحمي الكراتين من الرطوبة والضغط',
      excerpt: 'فرق الحرارة والتكديس والمناولة يقدرو يضرّو الكراتين. راجع التغليف والجفاف والتحميل والتصاور قبل ما تخرج السلعة.',
      share: 'قبل التحميل صيفط هاد اللائحة للمورّد والمخزن: شنو كيضر السلعة، واش ناشفة، كيفاش تترصّ، وشنو التصاور اللي خاصك.',
      sections: [
        ['كتب شنو يقدر يضر السلعة', 'سول المورّد واش السلعة كتضرّها الرطوبة، سهلة الكسر، خاصها تبقى واقفة أو ما يمكنش تحط فوقها شي حاجة. طلب نوع التغليف، الوزن الإجمالي والقياس ديال كل كرتونة. الحوايج الهشّة خاصها حماية وتثبيت من الداخل، والكرتونة الثقيلة خاصها تغليف يتحمّل التكديس.'],
        ['حارب الرطوبة قبل التحميل', 'ملي كتبدل الحرارة، بخار الما يقدر يتجمع فوق السقف والجوانب الباردة ديال الكونطونير. السلعة والكراتين والباليتات يقدرو يدخلو الرطوبة. راجع واش الكونطونير ناشف، واش فيه ضرر ولا آثار ديال الما. عالج السلعة أو التغليف المبلّل قبل التحميل. للحوايج الحساسة، اتّافق على العازل أو مواد امتصاص الرطوبة وعلى الكمية وفين يتحطّو.'],
        ['خطّط للتغليف والتحميل مع بعضهم', 'راجع التكديس وتوزيع الوزن والبلايص الخاوية والتثبيت. ما تحطّش سلعة ثقيلة فوق كراتين ما كيحمّلوهاش. فالشحن المجمّع، سول المخزن على شروط التغليف وبلغ بحدود التكديس قبل الحجز.'],
        ['خلي تصاور كيتربطو بنفس الشحنة', 'طلب تصاور حالة الكراتين والعلامات والباليتات أو التثبيت والتحميل ورقم الكونطونير. إلا كانت تصويرة للختم، سجّل الرقم ديالو. ملي تستلم، صوّر الطرود والضرر أو آثار الما والسلعة، وخلي التغليف والوثائق. تواصل بكري مع الترانزيتير والتأمين إلا كان، وسول على طريقة وآجال التبليغ.']
      ],
      message: 'السلعة [النوع]، كل كرتونة [القياس والوزن الإجمالي]، وحدود الرطوبة والتكديس [التفاصيل]. عفاك أكد نوع الكراتين أو الباليتات والحماية والتثبيت والتصاور اللي تقدر تصيفط قبل الشحن.'
    }
  }
];

const languages = ['zh', 'en', 'fr', 'ary'];
const labels = {
  zh: {message: '可复制的咨询消息', references: '参考资料', photo: '场景配图'},
  en: {message: 'Message to send to your forwarder', references: 'References', photo: 'Illustrative photograph'},
  fr: {message: 'Message à envoyer à votre transitaire', references: 'Références', photo: 'Photo d’illustration'},
  ary: {message: 'ميساج جاهز للترانزيتير', references: 'المراجع', photo: 'تصويرة توضيحية'}
};

const escape = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const localize = (article, field) => Object.fromEntries(
  languages.map(language => [language, article[language][field]])
);

function renderBody(article, language, cover) {
  const {sections, message} = article[language];
  const copy = labels[language];
  const paragraphs = sections.map(([heading, paragraph]) =>
    '<h2>' + escape(heading) + '</h2><p>' + escape(paragraph) + '</p>'
  );
  const references = article.links.map(([name, url]) =>
    '<li><a href="' + escape(url) + '">' + escape(name) + '</a></li>'
  );
  return [
    paragraphs[0],
    '<figure><img src="' + cover + '" alt="' + escape(article.photo[language]) + '">' +
      '<figcaption>' + escape(copy.photo) + '</figcaption></figure>',
    ...paragraphs.slice(1),
    '<h2>' + escape(copy.message) + '</h2><blockquote><p>' + escape(message) + '</p></blockquote>',
    '<h2>' + escape(copy.references) + '</h2><ul>' + references.join('') + '</ul>'
  ].join('\n');
}

export default {
  preparedAt: '2026-11-26',
  languages,
  articles: articles.map(article => {
    const cover = '/assets/articles/' + article.slug + '.jpg';
    return {
      slug: article.slug,
      category: 'ocean',
      cover,
      title: localize(article, 'title'),
      excerpt: localize(article, 'excerpt'),
      share: localize(article, 'share'),
      body: Object.fromEntries(languages.map(language => [language, renderBody(article, language, cover)]))
    };
  })
};
