//import { SystemActor } from "./modules/Actor/SystemActor.mjs";
import { ActorPjDataModel } from "./modules/DataModel/Actor/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./modules/DataModel/Actor/ActorPnjDataModel.mjs";
import { PjSheet } from "./modules/Sheet/Actor/PjSheet.mjs";
import { PnjSheet } from "./modules/Sheet/Actor/PnjSheet.mjs";


import * as DiceRollerHelper from "./modules/DiceRoller/_helpers.mjs";

//import { SystemItem } from "./modules/Item/SystemItem.mjs";
import { ArmeDataModel } from "./modules/DataModel/Item/ArmeDataModel.mjs";
import { ArmureDataModel } from "./modules/DataModel/Item/ArmureDataModel.mjs";
import { SortDataModel } from "./modules/DataModel/Item/SortDataModel.mjs";
import { ObjetDataModel } from "./modules/DataModel/Item/ObjetDataModel.mjs";

import { ArmeSheet } from "./modules/Sheet/Item/ArmeSheet.mjs";
import { ArmureSheet } from "./modules/Sheet/Item/ArmureSheet.mjs";
import { SortSheet } from "./modules/Sheet/Item/SortSheet.mjs";
import { ObjetSheet } from "./modules/Sheet/Item/ObjetSheet.mjs";

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

  DiceRollerHelper.fct.registerDiceRolls();


  CONFIG.Dice.terms[DeBeryllium.DENOMINATION] = DeBeryllium;
  CONFIG.Dice.terms[DeInterference.DENOMINATION] = DeInterference;
  //CONFIG.ChatMessage.documentClass = AttaqueMessage;

  registerHandleBarFunctions();

  DiceRollerHelper.fct.registerMessageEventListener();
});

