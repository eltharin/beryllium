import * as system  from "../../_helpers.mjs";

export async function getActorEffets(actor)
{
  const effets = {
    actor: actor.effects.contents.map(e => {return {
      cat : game.i18n.format("beryllium.effets.cat.aspects"),
      item: "",
      effet: e
    }}),
    culture: [],
    consequences: [],
    armes: actor.items.filter(i => i.type == "arme" && i.effects.contents.length > 0).reduce((a, b) => [...a, ...b.effects.contents.map(c => {
      return { 
        cat : game.i18n.format("beryllium.effets.cat.armes"), 
        item: b.name, 
        effet: c}
    }
    )], []),
    armures: actor.items.filter(i => i.type == "armure" && i.effects.contents.length > 0).reduce((a, b) => [...a, ...b.effects.contents.map(c => {
      return { 
        cat : game.i18n.format("beryllium.effets.cat.armures"), 
        item: b.name, 
        effet: c}
    }
    )], []),
    objets: actor.items.filter(i => i.type == "objet" && i.effects.contents.length > 0).reduce((a, b) => [...a, ...b.effects.contents.map(c => {
      return { 
        cat : game.i18n.format("beryllium.effets.cat.objets"), 
        item: b.name, 
        effet: c}
    }
    )], []),
  }

  if ("cultureobj" in actor.system && actor.system.cultureobj != null) { 
    actor.system.cultureobj.specialisations.forEach((e) => {
      if (e.isEffet == true) {
        effets.culture.push({
          cat : game.i18n.format("beryllium.effets.cat.culture"),
          item : "",
          effet: {
            name: e.titre,
            system: {
              effet: e.bonus,
              condition: ""
            }
          }
        });
      }
    });
  }

  for (const [category, consequence] of Object.entries(actor.system.consequences)) {
    consequence.values.forEach(c => {
      if (c != "") {
        effets.consequences.push({
          cat : game.i18n.format("beryllium.effets.cat.consequences"),
          item : category,
          effet: {
            name: "",
            system: {
              effet: c,
              condition: ""
            }
          }
        });
      }
    });
  }

  console.log(effets);

  let confirmed = await system.Common.Dialog.input({
    content: await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dialog/showAllEffets.hbs", {
      actor: actor,
      effets: effets,
    }),
    rejectClose: false,
    modal: true,
    position: {
      width : 700
    }
  });  
}
