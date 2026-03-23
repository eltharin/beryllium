

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class SortSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/sort.hbs",
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    actions: {

    },
    position: {
      width: 770,
      height: 300,
    },
    window: {
      resizable: true,
      controls: [

      ]
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.isVerrou = !this.document.testUserPermission(game.user, "canUpdate") || this.document.system.isDefault;

    return context
  }
}