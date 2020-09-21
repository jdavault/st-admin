const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

export const decode = entities.decode;
export const encode = entities.encode;
