import * as system  from "../_helpers.mjs";

import * as DiceRollerHelper from "./_helpers.mjs";
import { MessageActionResolver } from "../ChatMessage/MessageActionResolver.mjs";

export function registerDiceRolls() {
    CONFIG.Dice.rolls.push(DiceRollerHelper.CompetenceRoll);
    CONFIG.Dice.rolls.push(DiceRollerHelper.AttaqueRoll);
    CONFIG.Dice.rolls.push(DiceRollerHelper.DefenseRoll);
    CONFIG.Dice.rolls.push(DiceRollerHelper.InterferenceRoll);
    CONFIG.Dice.rolls.push(DiceRollerHelper.SurchauffeRoll);
    CONFIG.Dice.rolls.push(DiceRollerHelper.SortieSurchauffeRoll);
}

export function registerMessageEventListener() {
    Hooks.on("renderChatMessageHTML", (message, html, data) => {
        html.querySelectorAll(".dice-roll button[data-action]").forEach(btn => {
            btn.addEventListener("click", event => {
                console.log(event, message, data)
                const action = event.currentTarget.dataset.action;
                MessageActionResolver.executeAction(action, event, message, data);
            });
        });
    });

    MessageActionResolver.register("sortieSurchauffe", system.Actor.fct.sortieSurchauffe);
}