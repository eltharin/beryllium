import * as system  from "../../_helpers.mjs";

export class AttaqueRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/attaque/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
    
        if(this.options.actorMagie == undefined) {
            this.options.actorMagie = {
                actor : this.options.from,
                actorUuid: this.options.from.uuid,
                isDissonnance : this.options.from.system.magie.isDissonnance,
                isSurchauffe : this.options.from.system.magie.isSurchauffe,
            }
        }
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {
        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});

        ret.scene = this.options.scene;
        ret.targets = Object.values(this.options.targets).map(t => {t.canDefendre = (this.getPermission(t.id) && this.options.targets[t.id].result == null); return t;});

        ret.competenceLabel = this.options.competence;
        
        ret.item = this.options.item;

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
        return '';
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
        return game.scenes.get(this.options.scene).tokens
                .filter(t => (t.id in this.options.targets && this.options.targets[t.id].result == null))
                .filter(t => t.actor.testUserPermission(game.user, "OWNER"))
                ;
    }

    getPermission(tokenId)
    {
        return game.scenes.get(this.options.scene).tokens
                .filter(t => (t.id == tokenId && this.options.targets[t.id].result == null))
                .filter(t => t.actor.testUserPermission(game.user, "OWNER"))
                .length > 0;
    }
}