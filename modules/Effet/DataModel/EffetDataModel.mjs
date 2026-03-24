import * as system from "../../_helpers.mjs";



export class EffetDataModel extends system.Common.SystemDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/arme.svg"
  }

  static defineSchema() {
    return {
      effet: new foundry.data.fields.StringField({}),
      condition: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}