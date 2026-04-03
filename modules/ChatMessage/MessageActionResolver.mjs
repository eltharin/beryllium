import * as system  from "../_helpers.mjs";

export class MessageActionResolver {
    static actions = {
            defense: this._onDefense,
            affectDegat: this._onAffectDegat,
            majAttaque: this._onMajAttaque,
            reset: this._onReset,
    }

    static register(key, fct) {
        MessageActionResolver.actions[key] = fct;
        //foundry.applications.sidebar.tabs.ChatLog.DEFAULT_OPTIONS.actions[key] = fct;
    }

    static executeAction(action, event, message, data) {
        
        let act = this.actions[action];
        if(act != null) {
            act(event, message, data)
        } else {
            
        }
    }

    static async _onDefense(event, message, data) {
        const attaque = message.id;
        
        const msgAtt = game.messages.get(attaque);
        if(msgAtt == null)
        {
            throw new Error ("le message n'existe pas");
            return;
        }

        const scene = game.scenes.get(msgAtt.rolls[0].options.scene);
        if(msgAtt == null)
        {
            throw new Error ("la scene n'existe pas");
            return;
        }

        const avaiableTargets = msgAtt.rolls[0].getAvaiableTokenTarget(game.user);
        
        let token = avaiableTargets.filter(t => t.id == event.target.dataset.targetid)[0];

        if(token == null){
            ui.notifications.error(`Actor with name ${token.actor} not found.`);
            return;
        }        
        
        const modificateurs = await system.DiceRoller.DefenseRollDialog.create({attaque: msgAtt.rolls[0], token: token});
        if (modificateurs != null) //-- si l'utilisateur n'a pas annulé
        {
            const myRoll = new system.DiceRoller.DefenseRoll("4db",{}, {
                attaque: {
                    id: msgAtt.id,
                    result: msgAtt.rolls[0].getTotalValue(),
                    degats: msgAtt.rolls[0].options.item.degats,
                },
                defense: {
                    degats: modificateurs.reductionDegat,
                },
                competence: modificateurs.competence, 
                token: token.id,
                tokenuuid: token.uuid,
                actor: token.actor,
                scene: scene.id,
                coutFletrine: modificateurs.coutFletrine,
                actorCompetence: token.actor.system.competences[modificateurs.competence], 
                modificateurs: modificateurs, 
            });

            myRoll.toMessage({
                speaker: ChatMessage.getSpeaker({ alias: token.actor.name + " ( " + game.user.name + " )"}),
            });
        }
    }

    static _onAffectDegat(event, message, data) {
        message.rolls[0].setAffected(message);
    }

    static _onMajAttaque(event, message, data) {
        message.rolls[0].majAttaque(message);
    }

    static _onReset(event, message, data) {
        message.rolls[0].reset(message);
    }

}