import {BaseActorDataModel} from './BaseActorDataModel.mjs';
import {Cultures} from "../../Objet/Cultures.mjs";

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
                bonus : new foundry.data.fields.NumberField({initial: 0}),
            }),

        };
    }

    static preSaveFunctions = [
        ...super.preSaveFunctions,
        "verifMaxOubli",
    ];

    _prepareDerivedData() {
        this.nbCasesOubliTotal = this._getNbCasesOubliTotal(this);
        this.magie.seuil = this.competences.magie.value + Cultures.get(this.culture)?.modificateurMagie;
        this.magie.isResonnance = this.magie.fletrine.value > this.magie.fletrine.niveaux[0].max;
        this.magie.isDissonnance = (this.magie.fletrine.niveaux.filter(e => e.maxmax < this.magie.fletrine.value).length+1) >= this.magie.seuil ;
    }    

    _getNbCasesOubliTotal(elem) {
        return (elem.oubli.forceMax >= 0 ? elem.oubli.forceMax : 3 + elem.oubli.bonus + elem.competences?.volonte?.value);
    }
    
    verifMaxOubli(changes, clone){
        //-- oubli
        if(foundry.utils.getProperty(clone, "oubli.value") > this._getNbCasesOubliTotal(clone)) {
            foundry.utils.setProperty(changes, "system.oubli.value", this._getNbCasesOubliTotal(clone));
        }
    }
}