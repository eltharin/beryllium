import * as Helpers from "../../Helper/_helpers.mjs";



export class ObjetDataModel extends foundry.abstract.TypeDataModel {


  static defineSchema() {
    return {
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
    };
  }

  prepareDerivedData() {
      this.prix = Helpers.Argent.convertAtoB(this.prixmoyen);
  }
}