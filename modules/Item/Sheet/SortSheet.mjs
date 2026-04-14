

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class SortSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/sort.hbs",
    },
  };

  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    position: {
      width: 790,
      height: 330,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.isVerrou = !this.document.testUserPermission(game.user, "canUpdate") || this.document.system.isDefault;

    return context
  }
}