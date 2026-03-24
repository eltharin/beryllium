import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class ArmureSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/armure.hbs",
    },
  };

  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    position: {
      width: 770,
      height: 550,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.isVerrou = !this.document.testUserPermission(game.user, "canUpdate");

    return context
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }
}