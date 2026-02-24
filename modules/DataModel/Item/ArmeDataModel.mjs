import * as Helpers from "../../Helper/_helpers.mjs";


export class ArmeDataModel extends foundry.abstract.TypeDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/arme.svg"
  }

  static defineSchema() {
    return {
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      categorie: new foundry.data.fields.StringField({}),
      degat: new foundry.data.fields.NumberField({initial: 0}),
      portee: new foundry.data.fields.StringField({}),
      special: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      this.prix = Helpers.Argent.convertAtoB(this.prixmoyen);
  }
}