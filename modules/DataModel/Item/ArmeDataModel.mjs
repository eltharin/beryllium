


export class ArmeDataModel extends foundry.abstract.TypeDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/arme.svg"
  }

  static defineSchema() {
    return {
      prix: new foundry.data.fields.SchemaField({ 
        couronne: new foundry.data.fields.NumberField({initial: 0, min:0}),
        eclat: new foundry.data.fields.NumberField({initial: 0, min:0}),
        fragment: new foundry.data.fields.NumberField({initial: 0, min:0})
      }),
      categorie: new foundry.data.fields.StringField({}),
      degat: new foundry.data.fields.NumberField({initial: 0}),
      portee: new foundry.data.fields.StringField({}),
      special: new foundry.data.fields.StringField({}),
    };
  }
}