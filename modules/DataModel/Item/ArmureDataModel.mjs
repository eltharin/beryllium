import * as Helpers from "../../Helper/_helpers.mjs";


export class ArmureDataModel extends foundry.abstract.TypeDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/armure.svg"
  }

  static defineSchema() {
    return {
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      type: new foundry.data.fields.StringField({}),
      reduction: new foundry.data.fields.StringField({}),
      inconvenient: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      this.prix = Helpers.Argent.convertAtoB(this.prixmoyen);
  }
}