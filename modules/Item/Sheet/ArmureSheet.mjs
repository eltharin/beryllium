import * as system  from "../../_helpers.mjs";

import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class ArmureSheet extends BaseItemSheet {

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
    actions: {
      addEffet: this._onAddEffet,
      editEffet: this._onEditEffet,
      deleteEffet: this._onDeleteEffet,
    },
  }

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.isVerrou = !this.document.testUserPermission(game.user, "canUpdate");
    context.effets = this.document.effects;

    return context
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.prixmoyen", system.Common.Argent.convertBtoA(submitData.system.prix));

    return data ; 
  }
    
    static async _onAddEffet(event, target) {
      event.preventDefault();
      
      const effetData = {
        name: "Effet",
        type: "effet",
        system: {}
      };
      
      // Créer l'item sans render automatique
      const created = await this.document.createEmbeddedDocuments("ActiveEffect", [effetData], { render: true });
      if (created && created[0]) {
        created[0].sheet.render(true, { force: true });
      }
      
      return created;
    }
    
    static async _onEditEffet(event, target) {
      event.preventDefault();
      const effet = this.document.effects.get(target.dataset.effet);
      if (effet) {      
        if (effet.sheet.rendered) {
          effet.sheet.bringToTop();
        } else {
          effet.sheet.render(true, { force: true });
        }
      }
    }
    
    static async _onDeleteEffet(event, target) {
      event.preventDefault();
      const effet = this.document.effects.get(target.dataset.effet);
  
      if (effet) {
        
        let confirmed = false;
  
        if(event.ctrlKey && event.shiftKey)
        {
          confirmed = true;
        }
        else
        {
          confirmed = await system.Common.Dialog.confirm({
            content: `<p>Êtes-vous sûr de vouloir supprimer ${effet.name}?</p>`,
            rejectClose: false,
            modal: true
          });
        }
  
        if (confirmed) {
  
          await effet.delete({ render: true });
          ui.notifications.info(`${effet.name} supprimé(e)`);
        }
      }
    }  
}