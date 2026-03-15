
import * as DiceRollerHelper from "../_helpers.mjs";

export class SortieSurchauffeRoll extends DiceRollerHelper.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/sortieSurchauffe-roll-result.hbs";

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
        ret.resultat = this.getResultat();
        ret.totalText = this.getTotalText();
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();
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