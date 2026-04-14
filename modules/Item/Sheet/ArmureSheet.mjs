import * as system  from "../../_helpers.mjs";

import { BaseItemSheetWithEffects } from "./BaseItemSheetWithEffects.mjs";

export class ArmureSheet extends BaseItemSheetWithEffects {

  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/baseTemplate.hbs",
    },
    main: {
      template: "systems/beryllium/templates/item/armure.hbs",
      container: { id: "form" , element: ".tabscontainer" },
      scrollable: [''],
    },
    effects: {
      template: "systems/beryllium/templates/shared/effet/listEffets.hbs",
      container: { id: "form" , element: ".tabscontainer" },
      scrollable: [''],
    }
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "main", label:"beryllium.sheets.nav.main"},
        { id: "effects", label:"beryllium.sheets.nav.effects"},
      ],
      initial: "main",
    }
  };


  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    position: {
      width: 790,
      height: 680,
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