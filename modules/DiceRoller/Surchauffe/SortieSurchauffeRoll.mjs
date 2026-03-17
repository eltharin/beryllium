
import * as system  from "../../_helpers.mjs";

export class SortieSurchauffeRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
    }

    isCompetenceMagie()
    {
        return false;
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.title =  game.i18n.format("beryllium.roll.title.sortieSurchauffe");
        ret.result = game.i18n.format("beryllium.rolldice.result." + (this.getResultat() ? "reussite" : "echec"));
        ret.totalText = this.getTotalText();
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();
        ret.actions = this.getResultat() ? [
            {action: "sortieSurchauffe", label: game.i18n.format("beryllium.messages.surchauffe.valideSortie")}
        ] : [];
      //  ret.competenceLabel = this.options.competence;
        return ret;
    }

    getTotalParts()
    {
        return [
            this.options?.competenceValue
        ]
    }

    getSeuil() {
        return this.options.seuil;
    }
}