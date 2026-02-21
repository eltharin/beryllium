



export class ObjetDataModel extends foundry.abstract.TypeDataModel {


  static defineSchema() {
    return {
      prix: new foundry.data.fields.SchemaField({ 
        couronne: new foundry.data.fields.NumberField({initial: 0, min:0}),
        eclat: new foundry.data.fields.NumberField({initial: 0, min:0}),
        fragment: new foundry.data.fields.NumberField({initial: 0, min:0})
      }),
    };
  }
}