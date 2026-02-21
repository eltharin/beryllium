


export class SortDataModel extends foundry.abstract.TypeDataModel {
  constructor(data, options) {
    super(data, options);
    options.parent.img = "systems/beryllium/assets/pics/sort.svg"
  }

  static defineSchema() {
    // All Actors have resources.
    return {
      isDefault : new foundry.data.fields.BooleanField({initial: false}),
      level : new foundry.data.fields.NumberField({initial: 1, min:1}),
      effet : new foundry.data.fields.StringField({}),
    };
  }
}