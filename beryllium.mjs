import { SystemActor } from "./modules/Actor/SystemActor.mjs";
import { ActorPjDataModel } from "./modules/Actor/ActorPjDataModel.mjs";
import { ActorPnjDataModel } from "./modules/Actor/ActorPnjDataModel.mjs";
import { PjSheet } from "./modules/Actor/PjSheet.mjs";
import { PnjSheet } from "./modules/Actor/PnjSheet.mjs";

import { SystemItem } from "./modules/Item/SystemItem.mjs";
import { ItemArmeDataModel } from "./modules/Item/ItemArmeDataModel.mjs";
import { ItemArmureDataModel } from "./modules/Item/ItemArmureDataModel.mjs";
import { ItemSortDataModel } from "./modules/Item/ItemSortDataModel.mjs";

import { DeBeryllium } from "./modules/DeBeryllium.mjs";
import {CompetenceRoll} from "./modules/DiceRoller/Competence/CompetenceRoll.mjs";

Hooks.once("init", () => {
  console.log("beryllium | Initialisation du système beryllium");

  CONFIG.Actor.documentClass = SystemActor;
  CONFIG.Item.documentClass = SystemItem;


  CONFIG.Actor.dataModels = {
    pj: ActorPjDataModel,
    pnj: ActorPnjDataModel,
  };
  
  CONFIG.Item.dataModels = {
    arme: ItemArmeDataModel,
    armure: ItemArmureDataModel,
    sort: ItemSortDataModel
  };

  foundry.documents.collections.Actors.registerSheet("beryllium", PjSheet, {
    types: ["pj"],
    makeDefault: true,
    label: "Feuille de Personnage Joueur"
  });
  foundry.documents.collections.Actors.registerSheet("beryllium", PnjSheet, {
    types: ["pnj"],
    makeDefault: true,
    label: "Feuille de Personnage Joueur"
  });

  CONFIG.Dice.rolls.push(CompetenceRoll);
  CONFIG.Dice.terms[DeBeryllium.DENOMINATION] = DeBeryllium;

});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn({...this, index: i});
    return accum;
});
