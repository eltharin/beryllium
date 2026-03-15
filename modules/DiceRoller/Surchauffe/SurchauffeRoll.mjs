import {CompetenceRoll} from "../Competence/CompetenceRoll.mjs";


export class SurchauffeRoll extends Roll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/surchauffe/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
    }

    static fromData(data) {
        return super.fromData(data);
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.title = game.i18n.format("beryllium.roll.title.carac", {carac: this.options.competence});
        return ret;
    }

    getResult()
    {
        return this.total <= 6 ? "reussite" : "echec";
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format("beryllium.messages.surchauffe.result." + this.getResult());
        return ret;
    }
}