


export class CompetenceRoll extends Roll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/competence-roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format("beryllium.rolldice.result." + this.getResult());
        ret.totalText = this.total + " + " + (this.options?.modificateurs?.modificateur || 0) + " + " + (this.options?.actorCompetence.value || 0);
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();
        ret.competenceLabel = this.options.competence;
        return ret;
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

    static fromData(data) {
        return super.fromData(data);
    }

    getTotalValue() {
        return this.total + (this.options?.modificateurs?.modificateur || 0) + (this.options?.actorCompetence.value || 0);
    }

    getSeuil() {
        return (this.options?.modificateurs?.difficulte || 0);
    }
}