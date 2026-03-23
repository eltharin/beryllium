import * as system from "./modules/_helpers.mjs";

import { PjSheet } from "./modules/Actor/Sheet/PjSheet.mjs";
import { PnjSheet } from "./modules/Actor/Sheet/PnjSheet.mjs";

import { ActorPjDataModel } from "./modules/Actor/DataModel/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./modules/Actor/DataModel/ActorPnjDataModel.mjs";

import { ArmeSheet } from "./modules/Item/Sheet/ArmeSheet.mjs";
import { ArmureSheet } from "./modules/Item/Sheet/ArmureSheet.mjs";
import { SortSheet } from "./modules/Item/Sheet/SortSheet.mjs";
import { ObjetSheet } from "./modules/Item/Sheet/ObjetSheet.mjs";

import { ArmeDataModel } from "./modules/Item/DataModel/ArmeDataModel.mjs";
import { ArmureDataModel } from "./modules/Item/DataModel/ArmureDataModel.mjs";
import { SortDataModel } from "./modules/Item/DataModel/SortDataModel.mjs";
import { ObjetDataModel } from "./modules/Item/DataModel/ObjetDataModel.mjs";

import { DeBeryllium } from "./modules/Dice/DeBeryllium.mjs";
import { DeInterference } from "./modules/Dice/DeInterference.mjs";

import {registerFunctions as registerHandleBarFunctions} from "./modules/Handlebars.mjs"


Hooks.once("init", () => {
  console.log("beryllium | Initialisation du système beryllium");

  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
    pnjmajeur: ActorPnjDataModel,
    pnj: ActorPnjDataModel,
  };
  
  CONFIG.Item.dataModels = {
    arme: ArmeDataModel,
    armure: ArmureDataModel,
    sort: SortDataModel,
    objet: ObjetDataModel,
  };

  foundry.documents.collections.Actors.registerSheet("beryllium", PjSheet, {
    types: ["pj"],
    makeDefault: true,
    label: "Feuille de Personnage Joueur"
  });
  foundry.documents.collections.Actors.registerSheet("beryllium", PnjSheet, {
    types: ["pnjmajeur"],
    makeDefault: true,
    label: "Feuille de Personnage Non Joueur Majeur"
  });
  foundry.documents.collections.Actors.registerSheet("beryllium", PnjSheet, {
    types: ["pnj"],
    makeDefault: true,
    label: "Feuille de Personnage Non Joueur"
  });
  foundry.documents.collections.Items.registerSheet("beryllium", ArmeSheet, {
    types: ["arme"],
    makeDefault: true,
    label: "Feuille d'arme"
  });
  foundry.documents.collections.Items.registerSheet("beryllium", ArmureSheet, {
    types: ["armure"],
    makeDefault: true,
    label: "Feuille d'armure"
  });
  foundry.documents.collections.Items.registerSheet("beryllium", SortSheet, {
    types: ["sort"],
    makeDefault: true,
    label: "Feuille de sort"
  });
  foundry.documents.collections.Items.registerSheet("beryllium", ObjetSheet, {
    types: ["objet"],
    makeDefault: true,
    label: "Feuille d'objet"
  });

  system.DiceRoller.fct.registerDiceRolls();


  CONFIG.Dice.terms[DeBeryllium.DENOMINATION] = DeBeryllium;
  CONFIG.Dice.terms[DeInterference.DENOMINATION] = DeInterference;
  //CONFIG.ChatMessage.documentClass = AttaqueMessage;

  registerHandleBarFunctions();

  system.DiceRoller.fct.registerMessageEventListener();

  
    Hooks.on("canvasInit", (canvas) => {
      if(game.user.isGM) {
        new system.EchoMj.EchoMjApplication(canvas.scene);
      }
    });

      
    Hooks.on("updateScene", (scene, changes, options) => {
      if(game.user.isGM && changes.flags?.beryllium?.echoMj) {
        if(scene.id in game.echoMj) {
          game.echoMj[scene.id].updateRender(changes.flags?.beryllium?.echoMj);
        }
      }
    });

});

