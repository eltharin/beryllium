
import {CompetenceRollDialog} from "./Competence/CompetenceRollDialog.mjs";
import {CompetenceRoll} from "./Competence/CompetenceRoll.mjs";

export class DiceRoller {
    static async competenceRoll(options){
        const {actorName, competence} = options;

        
        const actor = game.actors.getName(actorName);
        if(actor == null){
            ui.notifications.error(`Actor with name ${actorName} not found.`);
            return;
        }

        const modificateurs = await CompetenceRollDialog.create();
        
        
        
        
        const myRoll = new CompetenceRoll("4db",{}, {competence: competence, actorCompetence: actor.system.competences[competence], modificateurs: modificateurs});

        myRoll.toMessage({});
    }
}