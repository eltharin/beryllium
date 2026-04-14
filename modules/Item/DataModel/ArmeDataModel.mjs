import * as system from "../../_helpers.mjs";



export class ArmeDataModel extends system.Common.SystemDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img ??= "systems/beryllium/assets/pics/arme.svg"
  }

  static defineSchema() {
    return {
      isDefault : new foundry.data.fields.BooleanField({initial: false}),
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      categorie: new foundry.data.fields.StringField({}),
      typeQte: new foundry.data.fields.StringField({initial: "melee"}),
      typeMunition: new foundry.data.fields.StringField({}),
      degat: new foundry.data.fields.NumberField({initial: 0}),
      portee: new foundry.data.fields.StringField({}),
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