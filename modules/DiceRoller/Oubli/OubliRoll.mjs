import * as system  from "../../_helpers.mjs";


export class OubliRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        
/*        if(this.options.actorMagie == undefined) {
            this.options.actorMagie = {
                actor : this.options.actor.obj,
                isDissonnance : this.options.actor.obj.system.magie.isDissonnance,
                isSurchauffe : this.options.actor.obj.system.magie.isSurchauffe,
            }
            
        }*/
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.title = game.i18n.format("beryllium.roll.oubli.title", {carac: this.options.competence});

        ret.actions = this.getActions();
        return ret;
    }

    isCompetenceMagie()
    {
        return false;
    }

    getActor()
    {
        return this.options.actorMagie;
    }

    getResult()
    {
        const resValue = this.getTotalValue() - this.getSeuil();

        if(resValue >= 3) return "illumination";
        else if(resValue > 0) return "claire";
        else if(resValue == 0) return "partielle";
        else if(resValue >= -2) return "cout";
        else return "rejet";
    }

    getResultText()
    {
        return game.i18n.format("beryllium.roll.oubli.result." + this.getResult());
    }

    getTotalParts()
    {
        return [
            this.options?.actor.competencepri.value,
            this.options?.actor.competencesec.value,
        ]
    }

    getSeuil() {
        return this.options.seuil;
    }

    getActions() {

        if(this.getResult() == "rejet") {
            return [
                {action: "perteOubli", label: game.i18n.format("beryllium.roll.oubli.action.rejet"), data: [{key: "nbpoint", value: 2}]},
            ];
        }
        else if(this.getResult() == "cout") {
            return [
                {action: "perteOubli", label: game.i18n.format("beryllium.roll.oubli.action.cout"), data: [{key: "nbpoint", value: 1}]},
            ];
        }
        else if(this.getResult() == "illumination") {
            return [
                {action: "gainFragment", label: game.i18n.format("beryllium.roll.oubli.action.illumination")},
            ];
        }

        
    }
}