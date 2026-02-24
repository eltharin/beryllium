
import {CompetenceRollDialog} from "./Competence/CompetenceRollDialog.mjs";
import {CompetenceRoll} from "./Competence/CompetenceRoll.mjs";

import {AttaqueRollDialog} from "./Attaque/AttaqueRollDialog.mjs";
import {AttaqueRoll} from "./Attaque/AttaqueRoll.mjs";

import {InterferenceRollDialog} from "./Interference/InterferenceRollDialog.mjs";
import {InterferenceRoll} from "./Interference/InterferenceRoll.mjs";

import {DefenseRollDialog} from "./Defense/DefenseRollDialog.mjs";
import {DefenseChoixTokenDialog} from "./Defense/DefenseChoixTokenDialog.mjs";
import {DefenseRoll} from "./Defense/DefenseRoll.mjs";

export class DiceRoller {
    static async competenceRoll(options){
        const {actor, competence} = options;

        const modificateurs = await CompetenceRollDialog.create();
        console.log(actor, competence, actor.system,actor.system.competences[competence])
        const myRoll = new CompetenceRoll("4db",{}, {
            competence: competence, 
            actorCompetence: actor.system.competences[competence], 
            modificateurs: modificateurs
        });

        myRoll.toMessage({});
    }
    
    static async attaqueRoll(options){
        const {actor, competence} = options;
        if([...game.user.targets].length == 0) {
            return ui.notifications.error(`Il n'y a pas de cible sélectionnée.`);
        }

        const modificateurs = await AttaqueRollDialog.create({isMagie: (competence == "magie"), competences: actor.system.competences});
        console.log(modificateurs)
        
        const myRoll = new AttaqueRoll("4db",{}, {
            competence: competence, 
            actorCompetence: actor.system.competences[modificateurs.competence], 
            modificateurs: modificateurs, 
            from: actor,
            scene: game.scenes.current.id,
            targets: [...game.user.targets].reduce(function(r, t) {
                r[t.id] = { id: t.document.id, actorId: t.document.actorId, name:t.document.name, result: null};
                return r;
            }, {}),
        });

        myRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ alias: actor.name + " ( " + game.user.name + " )"}),
        });
    }
    
    static async defenseRoll(options){
        const {attaque} = options;
        
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

        console.log(msgAtt.rolls[0]);
        console.log(avaiableTargets);
        
        let token = null;

        if(avaiableTargets.length > 1) {
            const choixToken = await DefenseChoixTokenDialog.create({scene: scene, avaiableTargets: avaiableTargets});
            token = avaiableTargets.filter(t => t.id == choixToken.token)[0];
        }
        else {
            token = avaiableTargets[0];
        }

        if(token == null){
            ui.notifications.error(`Actor with name ${token.actor} not found.`);
            return;
        }        
        

        const modificateurs = await DefenseRollDialog.create({attaque: msgAtt.rolls[0], token: token});
        
        
        //const token = scene.tokens.get(modificateurs.actor);
    
        const myRoll = new DefenseRoll("4db",{}, {
            attaque: {
                id: msgAtt.id,
                result: msgAtt.rolls[0].getTotalValue(),
            }, 
            competence: modificateurs.competence, 
            token: token.id,
            scene: scene.id,
            actorCompetence: token.actor.system.competences[modificateurs.competence], 
            modificateurs: modificateurs, 
        });

        myRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ alias: token.actor.name + " ( " + game.user.name + " )"}),
        });
    }

    static async interferenceRoll(options){
        const {actor} = options;

        const modificateurs = await InterferenceRollDialog.create();
        const myRoll = new InterferenceRoll("1di",{}, {
            modificateurs: modificateurs
        });

        myRoll.toMessage({});
    }    
}