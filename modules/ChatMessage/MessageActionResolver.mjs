import {DiceRoller} from "../DiceRoller/DiceRoller.mjs";


export class MessageActionResolver {
    static actions = {
            defense: this._onDefense,
            affectDegat: this._onAffectDegat,
            majAttaque: this._onMajAttaque,
            reset: this._onReset,
    }

    static executeAction(action, event, message, data) {
        
        let act = this.actions[action];
        if(act != null) {
            act(event, message, data)
        } else {
            ui.notifications.error(`action ${action} non trouvée.`);
        }
    }

    static _onDefense(event, message, data) {
        DiceRoller.defenseRoll({attaque: message.id});
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