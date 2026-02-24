


export class InterferenceRoll extends Roll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/interference/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        console.log(options)
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = this.getResult();

        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();

        return ret;
    }

    getResult()
    {
        const resValue = this.getTotalValue() - this.getSeuil();

        if(resValue > 0) return game.i18n.format("beryllium.roll.interference.result.reussite");
        else return game.i18n.format("beryllium.roll.interference.result.surcharge");
    }

    static fromData(data) {
        return super.fromData(data);
    }

    getTotalValue() {
        return this.total;
    }

    getSeuil() {
        return (this.options?.modificateurs?.difficulte);
    }
}