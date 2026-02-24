//import { SystemActor } from "./modules/Actor/SystemActor.mjs";
import { ActorPjDataModel } from "./modules/DataModel/Actor/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./modules/DataModel/Actor/ActorPnjDataModel.mjs";
import { PjSheet } from "./modules/Sheet/Actor/PjSheet.mjs";
import { PnjSheet } from "./modules/Sheet/Actor/PnjSheet.mjs";

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

import {CompetenceRoll} from "./modules/DiceRoller/Competence/CompetenceRoll.mjs";

Hooks.once("init", () => {
  console.log("beryllium | Initialisation du système beryllium");

  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
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
    label: "Feuille d'armure'"
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

  CONFIG.Dice.rolls.push(CompetenceRoll);
  CONFIG.Dice.terms[DeBeryllium.DENOMINATION] = DeBeryllium;
  CONFIG.Dice.terms[DeInterference.DENOMINATION] = DeInterference;
  //CONFIG.ChatMessage.documentClass = AttaqueMessage;
});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn({...this, index: i, index1: (i+1)});
    return accum;
});
