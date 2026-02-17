


export class ActorPjDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    // All Actors have resources.
    return {
        culture: new foundry.data.fields.StringField({ label: "Culture" }),
        aspects: new foundry.data.fields.SchemaField({ 
            concept: new foundry.data.fields.StringField({ label: "Concept" }),
            probleme: new foundry.data.fields.StringField({ label: "Concept" }),
            lien: new foundry.data.fields.StringField({ label: "Concept" }),
            methode: new foundry.data.fields.StringField({ label: "Concept" })
        }),
        heritage: new foundry.data.fields.SchemaField({
            affinite: new foundry.data.fields.StringField({ label: "Affinité" })
        }),
        competences: new foundry.data.fields.SchemaField({
            physique: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "Physique" })
            }),
            combat: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "combat" })
            }),
            discretion: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "discretion" })
            }),
            erudition: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "erudition" })
            }),
            magie: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "magie" })
            }),
            perception: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "perception" })
            }),
            influence: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "influence" })
            }),
            technique: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "technique" })
            }),
            volonte: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({ label: "volonte" })
            })
        })
    };
  }
}