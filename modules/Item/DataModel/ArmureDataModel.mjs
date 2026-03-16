import * as system from "../../_helpers.mjs";

export class ArmureDataModel extends system.Common.SystemDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/armure.svg"
  }

  static defineSchema() {
    return {
      isEquipe: new foundry.data.fields.BooleanField({initial: false}),
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      type: new foundry.data.fields.StringField({}),
      reductionDegat: new foundry.data.fields.SchemaField({ 
        combat   : new foundry.data.fields.NumberField({initial: 0}),
        physique : new foundry.data.fields.NumberField({initial: 0}),
        magie    : new foundry.data.fields.NumberField({initial: 0}),
        volonte  : new foundry.data.fields.NumberField({initial: 0}),
      }),
      bonusDefense: new foundry.data.fields.SchemaField({ 
        combat   : new foundry.data.fields.NumberField({initial: 0}),
        physique : new foundry.data.fields.NumberField({initial: 0}),
        magie    : new foundry.data.fields.NumberField({initial: 0}),
        volonte  : new foundry.data.fields.NumberField({initial: 0}),
      }),
      inconvenient: new foundry.data.fields.StringField({}),
    };
  }

  static preSaveFunctions = [
      "updateIsEquipe",
  ];

  prepareDerivedData() {
      this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }

  updateIsEquipe(changes, clone){
    if(foundry.utils.getProperty(clone, "isEquipe") == 1) {
        foundry.utils.setProperty(changes, "system.isEquipe", true);
    }
  }
}