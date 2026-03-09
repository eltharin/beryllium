import * as Helpers from "../../Helper/_helpers.mjs";


export class ArmureDataModel extends foundry.abstract.TypeDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/armure.svg"
  }

  static defineSchema() {
    return {
      isEquipe: new foundry.data.fields.BooleanField({initial: false}),
      prixmoyen: new foundry.data.fields.NumberField({initial: 0, min:0}),
      type: new foundry.data.fields.StringField({}),
      reduction: new foundry.data.fields.StringField({}), // TODO: remove in next major version
      reductionDegat: new foundry.data.fields.NumberField({}),
      bonusDefense: new foundry.data.fields.NumberField({initial: 0}),
      inconvenient: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      this.prix = Helpers.Argent.convertAtoB(this.prixmoyen);
      if(this.reductionDegat == undefined && this.reduction != undefined) // TODO: remove in next major version
      {
        this.reductionDegat = this.reduction;
      }
  }
}