


export class DefenseRoll extends Roll{
    static CHAT_TEMPLATE = "systems/beryllium/templates/dice/defense-roll-result.hbs";

    constructor(formula="", data={}, options={}) {
        super(formula, data, options);
        console.log(data, data.constructor.name, options);
        if(this.options.isAffected == undefined)
        {
            this.options.isAffected = false;
        }
        if(this.options.isAttaqueUpdated == undefined)
        {
            this.options.isAttaqueUpdated = false;
        }
        
    }

    async _prepareChatRenderContext({flavor, isPrivate=false, ...options}={}) {

        let ret = await super._prepareChatRenderContext({flavor, isPrivate, ...options});
        ret.result = game.i18n.format("beryllium.rolldice.result." + this.getResult());
        ret.totalText = this.total + " + " + (this.options?.modificateurs?.modificateur || 0) + " + " + (this.options?.actorCompetence.value || 0);
        ret.totalValue = this.getTotalValue();
        ret.seuil = this.getSeuil();
        ret.oppose = this.options?.attaque.result;
        
        ret.degats = this.getDegats();
        
        ret.competenceLabel = this.options.competence;

        ret.isAttaqueOwner = true;
        
        ret.canAffect = game.scenes.get(this.options.scene)?.tokens.get(this.options.token).actor.testUserPermission(game.user, "OWNER") && !this.options.isAffected;
        ret.canUpdateAttaque = game.messages.get(this.options.attaque.id).testUserPermission(game.user, "update") && !this.options.isAttaqueUpdated;

        console.log(this.options)
        console.log(this)

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

    getDegats() {
        return Math.max(0, this.options?.attaque.result - this.getTotalValue());
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