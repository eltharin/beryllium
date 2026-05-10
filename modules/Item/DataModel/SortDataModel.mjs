import * as system from "../../_helpers.mjs";
import { Cultures } from "../../Objet/Cultures.mjs";


export class SortDataModel extends system.Common.SystemDataModel {
  
  static DEFAULT_ICON  = "systems/beryllium/assets/pics/sort.svg";

  static defineSchema() {
    // All Actors have resources.
    return {
      isDefault : new foundry.data.fields.BooleanField({initial: false}),
      level : new foundry.data.fields.NumberField({initial: 1, min:1}),
      effet : new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
    
    this.coutFletrine = this.level;

    if (this.parent?.parent?.constructor.name != undefined) {
      const culture = Cultures.get(this.parent?.parent?.system?.culture);
      if (culture) {
        this.coutFletrine += culture.magie.malus[this.level] || 0;
      }
    }    
  }
}