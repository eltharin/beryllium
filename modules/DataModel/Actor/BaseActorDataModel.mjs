import {SystemDataModel} from "../SystemDataModel.mjs";
import {Magies} from "../../Magies.mjs";

export class BaseActorDataModel extends SystemDataModel {
    static defineSchema() {
    // All Actors have resources.
        return { 
            bourse: new foundry.data.fields.SchemaField({ 
                couronne: new foundry.data.fields.NumberField({initial: 0, min:0}),
                eclat: new foundry.data.fields.NumberField({initial: 0, min:0}),
                fragment: new foundry.data.fields.NumberField({initial: 0, min:0,
                    validate: value => value <20, validationError: `must be equal to `
                })
            }),
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
            echo: new foundry.data.fields.SchemaField({
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
            prouesses: new foundry.data.fields.SchemaField({
                max: new foundry.data.fields.NumberField({initial: 3}),
                values : new foundry.data.fields.ArrayField(
                    new foundry.data.fields.SchemaField({
                        nom: new foundry.data.fields.StringField({}),
                        effet: new foundry.data.fields.StringField({}),
                    })
                ),
            }),
        };
    }

    static preSaveFunctions = [
        "verifMaxStress",
        "verifMaxEcho",
        "verifFletrineEcho",
    ];
    
    prepareDerivedData() {
        
        this.nbCasesStressTotal = this._getNbCasesStressTotal(this);
        this.nbCasesEchoTotal = this._getNbCasesEchoTotal(this);

        this.magie.affiniteobj = Magies.get(this.magie.affinite);
        this.magie.oppose = this.magie.affiniteobj != null ? Magies.get(this.magie.affiniteobj.oppose) : null;

        this._prepareDerivedData();
    }

    _getNbCasesStressTotal(elem) {
        return (elem.stress.forceMax >= 0 ? elem.stress.forceMax : 3 + Math.max(elem.competences?.physique?.value , elem.competences?.magie?.value , elem.competences?.magie?.value));
    }

    _getNbCasesEchoTotal(elem) {
        return (elem.echo.forceMax >= 0 ? elem.echo.forceMax : 5);
    }

    _prepareDerivedData() {

    }
    
    //-- fonctions de vérification preCreate et preUpdate

    verifMaxStress(changes, clone){
        if(foundry.utils.getProperty(clone, "stress.value") > this._getNbCasesStressTotal(clone)) {
            foundry.utils.setProperty(changes, "system.stress.value", this._getNbCasesStressTotal(clone));
        }
    }
    
    verifMaxEcho(changes, clone){
        if(foundry.utils.getProperty(clone, "echo.value") > this._getNbCasesEchoTotal(clone)) {
            foundry.utils.setProperty(changes, "system.echo.value", this._getNbCasesEchoTotal(clone));
        }
    }
    
    verifFletrineEcho(changes, clone){
        const max = clone.magie.fletrine.niveaux.reduce((tot, val) => tot + val.max,0);
        if(foundry.utils.getProperty(clone, "magie.fletrine.value") > max) {
            foundry.utils.setProperty(changes, "system.magie.fletrine.value", max);
        }
    }
}