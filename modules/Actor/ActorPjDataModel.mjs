


export class ActorPjDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    // All Actors have resources.
    return {
        culture: new foundry.data.fields.StringField({}),
        aspects: new foundry.data.fields.SchemaField({ 
            concept: new foundry.data.fields.StringField({}),
            probleme: new foundry.data.fields.StringField({}),
            lien: new foundry.data.fields.StringField({}),
            methode: new foundry.data.fields.StringField({})
        }),
        heritage: new foundry.data.fields.SchemaField({
            affinite: new foundry.data.fields.StringField({}),
            incomp: new foundry.data.fields.StringField({}),
            privilege: new foundry.data.fields.StringField({}),
            faiblesse: new foundry.data.fields.StringField({}),
            tradition: new foundry.data.fields.StringField({}),
            specialisation: new foundry.data.fields.StringField({}),
        }),
        competences: new foundry.data.fields.SchemaField({
            physique: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            combat: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            discretion: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            erudition: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            magie: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            perception: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            influence: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            technique: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            }),
            volonte: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({})
            })
        }),
        stress: new foundry.data.fields.SchemaField({
            physique: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({}),
                max: new foundry.data.fields.NumberField({}),
            }),
            mental: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({}),
                max: new foundry.data.fields.NumberField({}),
            }),
            magie: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({}),
                max: new foundry.data.fields.NumberField({}),
            }),
        })
    };
  }
}