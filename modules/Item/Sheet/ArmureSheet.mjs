import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class ArmureSheet extends BaseItemSheet {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/armure.hbs",
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
      width: 950,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [

      ]
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

    foundry.utils.setProperty(data, "system.prixmoyen", Helpers.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }
}