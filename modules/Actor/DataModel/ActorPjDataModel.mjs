import * as system from "../../_helpers.mjs";

export class ActorPjDataModel extends system.Actor.BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
            xp: new foundry.data.fields.NumberField({initial: 0, min:0}),
            
            culture: new foundry.data.fields.StringField({}),
            heritage: new foundry.data.fields.SchemaField({
                aspect: new foundry.data.fields.StringField({}),
                utilisationPrivilege: new foundry.data.fields.ArrayField(
                    new foundry.data.fields.SchemaField({
                        value: new foundry.data.fields.NumberField({initial: 0, min:0}),
                        max: new foundry.data.fields.NumberField({initial: 1, min:1}),
                    })
                )
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
        "checkDissonance",
    ];

    _prepareDerivedData() {
        this.nbCasesOubliTotal = this._getNbCasesOubliTotal(this);
        
        this.cultureobj = system.Objet.Cultures.get(this.culture);

        if(this.heritage.utilisationPrivilege == undefined)
        {
            this.heritage.utilisationPrivilege = [];
        }

        if(this.cultureobj != undefined) {
            this.cultureobj.privileges.forEach((v, k) => {
            if(this.heritage.utilisationPrivilege[k] == undefined)
            {
                this.heritage.utilisationPrivilege[k] = {value:0, max:1};
            }
            });
        }
    }    

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        this.parent.prototypeToken.updateSource({actorLink: true, "sight.enabled": true});
    }

    checkDissonance(changes, clone) 
    {
        if(this.magie.isSurchauffe && this.magie.isDissonnance && !clone.magie.isDissonnance){
            foundry.utils.setProperty(changes, "system.magie.isSurchauffe", false);
        }      
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