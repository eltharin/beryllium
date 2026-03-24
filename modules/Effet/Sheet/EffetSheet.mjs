import * as system  from "../../_helpers.mjs";



export class EffetSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActiveEffectConfig
) {

  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/effet/effet.hbs",
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
      height: 550,
    },
    window: {
      resizable: true,
      controls: [

      ]
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.system = this.document.system;
    context.isVerrou = !this.document.testUserPermission(game.user, "canUpdate");

    return context
  }
/*
  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);


    return data ; 
  }*/
}