import * as DiceRollerHelper from "../_helpers.mjs";

export class AttaqueRoll extends DiceRollerHelper.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/attaque-roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
    
        if(this.options.actorMagie == undefined) {
            this.options.actorMagie = {
                actor : this.options.from,
                isDissonnance : this.options.from.system.magie.isDissonnance,
                isSurchauffe : this.options.from.system.magie.isSurchauffe,
            }
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format("beryllium.rolldice.result." + this.getResult());
        ret.totalText = this.getTotalText();
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();

        ret.scene = this.options.scene;
        ret.targets = this.options.targets;
        ret.competenceLabel = this.options.competence;
        
        ret.item = this.options.item;

        ret.canDefendre = this.canDefendre(game.user);
        return ret;
    }

    isCompetenceMagie()
    {
        return this.options.competence == "magie";
    }

    getActor()
    {
        return this.options.actorMagie;
    }

    getResult()
    {
        const resValue = this.getTotalValue() - this.getSeuil();

        if(resValue >= 3) return "reussiteExceptionnelle";
        else if(resValue > 0) return "reussite";
        else if(resValue == 0) return "reussiteJustesse";
        else if(resValue >= -2) return "echec";
        else return "echecCritique";
    }

    getTotalParts()
    {
        return [
            this.options?.actorCompetence?.value,
            this.options?.modificateurs?.modificateur,

        ]
    }

    getSeuil() {
        return (this.options?.modificateurs?.difficulte || 0);
    }

    getAvaiableTokenTarget()
    {
        console.log(this.options.targets);
        return game.scenes.get(this.options.scene).tokens
                .filter(t => (t.id in this.options.targets && this.options.targets[t.id].result == null))
                .filter(t => t.actor.testUserPermission(game.user, "OWNER"))
                ;
    }

    canDefendre(user){
        console.log()
        return this.getAvaiableTokenTarget(user).length > 0;
    }
}