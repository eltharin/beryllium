
import * as system  from "../../_helpers.mjs";

export class DefenseRoll extends system.DiceRoller.BaseRoll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/defense/roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);

        if(this.options.isAffected == undefined)
        {
            this.options.isAffected = false;
        }
        if(this.options.isAttaqueUpdated == undefined)
        {
            this.options.isAttaqueUpdated = false;
        }

        const msgAtt = game.messages.get(this.options.attaque.id);    
        
        if(this.options.actorMagie == undefined) {
            this.options.actorMagie = {
                actor : this.options.actor,
                isDissonnance : this.options.actor.system.magie.isDissonnance,
                isSurchauffe : this.options.actor.system.magie.isSurchauffe,
            }
            
        }  
    }

    isCompetenceMagie()
    {
        return this.options.competence == "magie";
    }

    getActor()
    {
        return this.options.actorMagie;
    }

    getTotalParts()
    {
        return [
            this.options?.actorCompetence?.value,
            this.options?.modificateurs?.modificateur,

        ]
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {

        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format("beryllium.rolldice.result." + this.getResult());
        /*ret.totalText = (this.options?.actorCompetence?.value || 0) + " + " + (this.options?.modificateurs?.modificateur || 0) + " + " + this.total;
        ret.totalValue = this.getTotalValue();
        */
        ret.totalText = this.getTotalText();
        ret.totalValue = this.getTotalValue();

        ret.seuil = this.getSeuil();
        ret.oppose = this.options?.attaque.result;
        
        ret.hit = this.getHit();
        ret.degats = this.getDegats();
        ret.degatsFormula = this.getDegatsFormula();
        
        ret.competenceLabel = this.options.competence;

        ret.isAttaqueOwner = true;
        
        ret.canAffect = game.scenes.get(this.options.scene)?.tokens.get(this.options.token).actor.testUserPermission(game.user, "OWNER") && !this.options.isAffected;
        ret.canUpdateAttaque = game.messages.get(this.options.attaque.id).testUserPermission(game.user, "update") && !this.options.isAttaqueUpdated;

        ret.isGm = game.user.isGM;


        return ret;
    }

    getResult()
    {
        return this.options?.attaque.result - this.getTotalValue();
    }

    getHit()
    {
        return this.getResult() > 0
    }

    static fromData(data) {
        return super.fromData(data);
    }

    getSeuil() {
        return (this.options?.modificateurs?.difficulte || 0);
    }

    getDegatComposantes()
    {
        return [
            this.options?.attaque.result,
            [this.getTotalValue(), "-"],
            this.options.attaque.degats,
            [this.options.defense.degats, "-"]
        ];
    }

    getDegats() {
        if(!this.getHit())
        {
            return 0;
        }

        return Math.max(1, this.getCalculValue(this.convertTotal(this.getDegatComposantes())));
    }

    getDegatsFormula() {
        return this.getCalculText(this.convertTotal(this.getDegatComposantes()));
    }

    setAffected(message)
    {
        const actor = game.scenes.get(this.options.scene)?.tokens.get(this.options.token).actor;

        actor.update({"system.stress.value": actor.system.stress.value + this.getDegats()});
        
        const reste = Math.max(0, actor.system.nbCasesStressTotal - actor.system.stress.value - this.getDegats());

        ui.notifications.info(`${actor.name} prend ${this.getDegats()} pts de stress, il lui en reste ${reste}.`);
        this.options.isAffected = true;
        message.update({rolls: [this]});
    }

    majAttaque(message)
    {
        const msgAtt = game.messages.get(this.options.attaque.id);
        msgAtt.rolls[0].options.targets[this.options.token].result = this.getDegats();

        msgAtt.update({rolls: [msgAtt.rolls[0]]});
 
        this.options.isAttaqueUpdated = true;
        message.update({rolls: [this]});
    }
    

    reset(message)
    {
        this.options.isAffected = false;
        this.options.isAttaqueUpdated = false;
        message.update({rolls: [this]});

        const msgAtt = game.messages.get(this.options.attaque.id);
        msgAtt.rolls[0].options.targets[this.options.token].result = null;

        msgAtt.update({rolls: [msgAtt.rolls[0]]});
    }
}