import * as system from "../../_helpers.mjs";



export class EffetDataModel extends system.Common.SystemDataModel {
  constructor(data, options) {
    super(data, options);
    
  }

  static defineSchema() {
    return {
      effet: new foundry.data.fields.StringField({}),
      condition: new foundry.data.fields.StringField({}),
    };
  }

  prepareDerivedData() {
      
  }
}