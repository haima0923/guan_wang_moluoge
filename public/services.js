// Stable field keys keep existing sea, air and customs content editable.
export const SERVICE_CATALOG = [
  {id:'sea', key:'service1', icon:'ship', editorLabel:'国际海运'},
  {id:'air', key:'service2', icon:'plane', editorLabel:'国际空运'},
  {id:'land', key:'service5', icon:'truck', editorLabel:'集装箱陆运'},
  {id:'warehouse', key:'service6', icon:'warehouse', editorLabel:'仓储服务'},
  {id:'customs', key:'service3', icon:'customs', editorLabel:'报关报检'},
  {id:'ddp', key:'service7', icon:'link', editorLabel:'双清包税'}
];
export const ENQUIRY_SERVICE_IDS = [...SERVICE_CATALOG.map(service => service.id), 'door'];
