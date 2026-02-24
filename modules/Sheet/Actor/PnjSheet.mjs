import { PjSheet } from "./PjSheet.mjs";

export class PnjSheet extends PjSheet{
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/actor/pj/pnj-sheet.hbs",
      templates: [
        'systems/beryllium/templates/actor/pj/parts/topbar.hbs',
        'systems/beryllium/templates/actor/pj/parts/sidebar.hbs',
        'systems/beryllium/templates/actor/pj/parts/aspects.hbs',
        'systems/beryllium/templates/actor/pj/parts/magie.hbs',
        'systems/beryllium/templates/actor/pj/parts/heritage.hbs',
        'systems/beryllium/templates/actor/pj/parts/prouesses.hbs',
        'systems/beryllium/templates/actor/pj/parts/consequences.hbs',
        'systems/beryllium/templates/actor/pj/parts/combat.hbs',
        'systems/beryllium/templates/actor/pj/parts/equipements.hbs',
        'systems/beryllium/templates/actor/pj/parts/notes.hbs',
        'systems/beryllium/templates/actor/pj/parts/max.hbs',
      ] 
    },
  };
}