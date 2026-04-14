import * as system from "../../_helpers.mjs";



export class MunitionDataModel extends system.Common.SystemDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img ??= "systems/beryllium/assets/pics/munition.svg"
  }

  static defineSchema() {
    return {
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      typeMunition: new foundry.data.fields.StringField({}),
      degat: new foundry.data.fields.NumberField({initial: 0}),
      special: new foundry.data.fields.StringField({}),
      quantiteConso: new foundry.data.fields.SchemaField({ 
        value   : new foundry.data.fields.NumberField({initial: 0}),
        max : new foundry.data.fields.NumberField({initial: 0}),
      }),
    };
  }

  prepareDerivedData() {
      this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}