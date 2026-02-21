import {BaseActorDataModel} from './BaseActorDataModel.mjs';


export class ActorPjDataModel extends BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
            culture: new foundry.data.fields.StringField({}),
            
            heritage: new foundry.data.fields.SchemaField({
                affinite: new foundry.data.fields.StringField({}),
            }),
            oubli: new foundry.data.fields.SchemaField({
                value : new foundry.data.fields.NumberField({initial: 0, min:0}),
                forceMax : new foundry.data.fields.NumberField({initial: -1}),
            }),

        };
    }

    _prepareDerivedData() {
        this.nbCasesOubliTotal = (this.oubli.forceMax >= 0 ? this.oubli.forceMax : 3 + this.competences?.volonte?.value);
    }
}