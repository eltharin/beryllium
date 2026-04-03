import * as system  from "../_helpers.mjs";

import { MessageActionResolver } from "../ChatMessage/MessageActionResolver.mjs";

export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(system.DiceRoller.CompetenceRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.AttaqueRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.DefenseRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.InterferenceRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.SurchauffeRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.SortieSurchauffeRoll);
    CONFIG.Dice.rolls.push(system.DiceRoller.OubliRoll);
}

export function registerMessageEventListener() {
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        html.querySelectorAll(".dice-roll button[data-action]").forEach(btn => {
            btn.addEventListener("click", event => {
                const action = event.currentTarget.dataset.action;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });
        
        html.querySelectorAll(".dice-roll [data-hover]").forEach(btn => {
            btn.addEventListener("mouseenter", event => {
                const action = event.currentTarget.dataset.hover;
                MessageActionResolver.executeAction(action, event, message, data);
            });
            
            btn.addEventListener("mouseout", event => {
                const action = event.currentTarget.dataset.hover;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });
    });

    MessageActionResolver.register("sortieSurchauffe", system.Actor.fct.sortieSurchauffe);
    MessageActionResolver.register("perteOubli", system.Actor.fct.perteOubli);
    MessageActionResolver.register("gainFragment", system.Actor.fct.gainFragment);
    MessageActionResolver.register("affectFletrine", system.Actor.fct.affectFletrine);

    MessageActionResolver.register("showTarget", system.Actor.fct.showTarget);
}