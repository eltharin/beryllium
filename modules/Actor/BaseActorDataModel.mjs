import {Magies} from "../Magies.mjs";


export class BaseActorDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            aspects: new foundry.data.fields.SchemaField({ 
                concept: new foundry.data.fields.StringField({}),
                probleme: new foundry.data.fields.StringField({}),
                lien: new foundry.data.fields.StringField({}),
                methode: new foundry.data.fields.StringField({})
            }),
            competences: new foundry.data.fields.SchemaField({
                physique: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                combat: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                discretion: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                erudition: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                magie: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                perception: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                influence: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                technique: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                }),
                volonte: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0})
                })
            }),
            stress: new foundry.data.fields.SchemaField({
                value : new foundry.data.fields.NumberField({initial: 0, min:0}),
                forceMax : new foundry.data.fields.NumberField({initial: -1}),
            }),
            magie: new foundry.data.fields.SchemaField({
                affinite: new foundry.data.fields.StringField({}),
                tradition: new foundry.data.fields.StringField({}),
                seuiltolerence: new foundry.data.fields.NumberField({initial: 0, min:0}),
                fletrine: new foundry.data.fields.SchemaField({
                    value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                    niveaux: new foundry.data.fields.ArrayField(
                        new foundry.data.fields.SchemaField({
                            max : new foundry.data.fields.NumberField({})
                        }), {initial: [{max:5},{max:5},{max:5},{max:5},{max:5}]}
                    ),
                })
            }),
            consequences: new foundry.data.fields.SchemaField({
                legere: new foundry.data.fields.SchemaField({
                    max: new foundry.data.fields.NumberField({initial: 1}),
                    values: new foundry.data.fields.ArrayField(
                        new foundry.data.fields.StringField({})
                    ),
                }),
                modere: new foundry.data.fields.SchemaField({
                    max: new foundry.data.fields.NumberField({initial: 1}),
                    values: new foundry.data.fields.ArrayField(
                        new foundry.data.fields.StringField({})
                    ),
                }),
                grave: new foundry.data.fields.SchemaField({
                    max: new foundry.data.fields.NumberField({initial: 1}),
                    values: new foundry.data.fields.ArrayField(
                        new foundry.data.fields.StringField({})
                    ),
                }),
            }),
            prouesses: new foundry.data.fields.ArrayField(
                new foundry.data.fields.SchemaField({
                    nom: new foundry.data.fields.StringField({}),
                    effet: new foundry.data.fields.StringField({}),
                })
            ),
        };
    }

    
    prepareDerivedData() {
        
        this.nbCasesStressTotal = (this.stress.forceMax >= 0 ? this.stress.forceMax : 3 + Math.max(this.competences?.physique?.value , this.competences?.magie?.value , this.competences?.magie?.value));
        
        this.magie.affiniteobj = Magies.get(this.magie.affinite);
        this.magie.oppose = this.magie.affiniteobj != null ? Magies.get(this.magie.affiniteobj.oppose) : null;

        this._prepareDerivedData();
    }

    _prepareDerivedData() {

    }
    
    validate(options)
    {
        console.log(options);
        console.log(this._source.magie.fletrine.value);

        if(this._source.magie.fletrine.value >= 12)
        {
            return false;
        }
        else{
        return true;
        }
    }
}