import * as system from "../../_helpers.mjs";



export class ObjetDataModel extends system.Common.SystemDataModel {


  static defineSchema() {
    return {
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
    };
  }

  prepareDerivedData() {
      this.prix = system.Common.Argent.convertAtoB(this.prixmoyen);
  }
}