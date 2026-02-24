import * as Helpers from "../../Helper/_helpers.mjs";

export class ArmeSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/arme.hbs",
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

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", Helpers.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }
}