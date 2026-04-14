import * as system  from "../../_helpers.mjs";
import { BaseSheet } from "../../Models/Sheet/BaseSheet.mjs";


export class BaseActorSheet extends BaseSheet (
  foundry.applications.sheets.ActorSheetV2
) {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/actor/pj/pj-sheet.hbs",
      templates: [
        'systems/beryllium/templates/actor/pj/parts/topbar.hbs',
        'systems/beryllium/templates/actor/pj/parts/sidebar.hbs',
        "systems/beryllium/templates/shared/effet/listEffets.hbs",
      ] 
    },
    
    aspects: {
      template: "systems/beryllium/templates/actor/pj/parts/aspects.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    magie: {
      template: "systems/beryllium/templates/actor/pj/parts/magie.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    heritage: {
      template: "systems/beryllium/templates/actor/pj/parts/heritage.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    prouesses: {
      template: "systems/beryllium/templates/actor/pj/parts/prouesses.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    consequences: {
      template: "systems/beryllium/templates/actor/pj/parts/consequences.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    combat: {
      template: "systems/beryllium/templates/actor/pj/parts/combat.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    equipements: {
      template: "systems/beryllium/templates/actor/pj/parts/equipements.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    notes: {
      template: "systems/beryllium/templates/actor/pj/parts/notes.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
    max: {
      template: "systems/beryllium/templates/actor/pj/parts/max.hbs",
      container: { id: "form" , element: ".tabscontainer" },
    },
  };

  static TABS = {
    sheet: {
      tabs: [
        { id: "aspects", label:"beryllium.pjsheet.tabs.aspects"},
        { id: "magie", label:"beryllium.pjsheet.tabs.magie"},
        { id: "heritage", label:"beryllium.pjsheet.tabs.heritage", condition: (actor) => this.hasHeritageTab(actor)},
        { id: "prouesses", label:"beryllium.pjsheet.tabs.prouesses"},
        { id: "consequences", label:"beryllium.pjsheet.tabs.consequences"},
        { id: "combat", label:"beryllium.pjsheet.tabs.combat"},
        { id: "equipements", label:"beryllium.pjsheet.tabs.equipements"},
        { id: "notes", label:"beryllium.pjsheet.tabs.notes"},
        { id: "max", label:"beryllium.pjsheet.tabs.max", condition: () => game.user.isGM,},
      ],
      initial: "aspects",
    }
  };

  _getTabsConfig(group) {
    const tabs = foundry.utils.deepClone(super._getTabsConfig(group))

    // Modify tabs based on document properties
    if (this.document.type === 'weapon') {
      tabs.tabs.push({ id: 'combat', group: 'sheet', label: 'DCC.Combat' })
    }

    return tabs
  }

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    classes: ["beryllium-sheet", "beryllium-sheet-pj"],
    actions: {
      skillRoll: this._onSkillRoll,
      toggle: this._onToggle,
      addRemove: this._onAddRemove,
      showArtwork: this.#showArtwork,
      addItem: this._onAddItem,
      editItem: this._onEditItem,
      deleteItem: this._onDeleteItem,
      repos: this._onRepos,
      depense: this._onDepense,
      attaque: this._onAttaque,
      deInterference: this._onDeInterference,
      verouillage: this.verouillage,
      deverouillage: this.deverouillage,
      usePrivilege: this._onUsePrivilege,
      managePrivilege: this._onManagePrivilege,
      equipeArmure: this._onEquipeArmure,
      desequipeArmure: this._onDesequipeArmure,
      jetSortieSurchauffe: this._onJetSortieSurchauffe,
      deOubli: this._onDeOubli,
      utilisationProuesse: this._onUtilisationProuesse,
      addEffet: this._onAddEffet,
      editEffet: this._onEditEffet,
      deleteEffet: this._onDeleteEffet,
      showAllEffets: this.onShowAllEffets
    },
    position: {
      width: 1030,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [
        {
          action: "verouillage",
          icon: "fa-solid fa-lock",
          label: "beryllium.pjsheet.action.lock",
          ownership: "OWNER",
          visible: this.#canVerouillage
        },
        {
          action: "deverouillage",
          icon: "fa-solid fa-unlock",
          label: "beryllium.pjsheet.action.unlock",
          ownership: "OWNER",
          visible: this.#canDeverouillage
        }
      ]
    },
  }

  static #showArtwork(event, target) {
    console.log("showartwork")
    new foundry.applications.apps.ImagePopout({
      src: target.getAttribute("src"),
      uuid: this.actor.uuid,
      window: { title: this.actor.name }
    }).render({ force: true });
  }

  static #canVerouillage() {
    return this.isEditable && !this.actor.system.isLocked;
  }
  
  static #canDeverouillage() {
    return this.isEditable && this.actor.system.isLocked;
  }
  
  static hasHeritageTab(elem) {
    return elem.document.type == "pj";
  }

  static async verouillage() {
    await this.actor.update({"system.isLocked":true});
    this._updateFrame({window: {}});
  }
  
  static async deverouillage() {
    await this.actor.update({"system.isLocked":false});
    this._updateFrame({window: {}});
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.argent", system.Common.Argent.convertBtoA(submitData.system.bourse));

    return data ; 
  }

  
  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.isVerrou = this.actor.system.isLocked;

    context.isGm = game.user.isGM;
    context.isPJ = this.constructor.name == "PjSheet";
    
    context.system = this.actor.system  // Note: this.actor for ActorSheetV2
    context.flags = this.actor.flags     // or this.document for ApplicationV2

    //-- culture ------------------------------------------------
    context.listes = {};

    context.culture = {
      list: system.Objet.Cultures.list(),
    }
    context.listes.magies = {
      list: system.Objet.Magies.list(),
    }

    

    //-- stress ------------------------------------------------
    context.stress = {
      valcheck : context.system.stress.value,
      valnoncheck : this.actor.system.nbCasesStressTotal - context.system.stress.value,
    }

    context.echo = {
      valcheck : context.system.echo.value,
      valnoncheck : this.actor.system.nbCasesEchoTotal - context.system.echo.value,
    }

    if(context.system.oubli !== undefined)
    {
      context.oubli = {
        valcheck : context.system.oubli.value,
        valnoncheck : this.actor.system.nbCasesOubliTotal - context.system.oubli.value,
      }
    }


    //-- fletrine ------------------------------------------------
    context.fletrine = {};

    let restValue = context.system.magie.fletrine.value;

    context.system.magie.fletrine.niveaux.forEach((niv,key) => {
      if(niv.max > 0)
      {
        let valUtil = Math.min(restValue, niv.max);
        restValue = restValue - valUtil;

        context.fletrine[key] = {
          label : game.i18n.format("beryllium.label.niv") + (key+1),
          nbCheck: valUtil,
          nbNoncheck : niv.max - valUtil,
          isMax: context.system.magie.fletrine.value >= (context.system.magie.fletrine.niveaux[key-1]?.maxmax || 0)
        }
      }
    });

    
    
    let allItems = foundry.utils.deepClone(this.document.items.documentsByType);

    const triCustomDefault = function(array) {
      return {
        default : array.filter(i => i.system.isDefault == true),
        custom : array.filter(i => i.system.isDefault == false),
      }
    };

    context.effets = this.document.effects.filter(e => e.type != "base");

    context.aspects = allItems.aspect || [];
    delete allItems.aspect;

    context.armes = triCustomDefault(allItems.arme || []);
    delete allItems.arme;
    context.munitions = allItems.munition || [];
    delete allItems.munition;
    context.armures = allItems.armure || [];
    delete allItems.armure;
    context.sorts = triCustomDefault(allItems.sort || []);
    delete allItems.sort;
    
    context.sorts.default.sort((a,b) => a.system.level > b.system.level ? 1 : -1);
    context.sorts.custom.sort((a,b) => a.system.level > b.system.level ? 1 : -1);

    context.items = Object.values(allItems).reduce((a, b ) => [...a, ...b], []);


    return context
  }


  checkDefaultItems(context)
  {
    const defaultSorts = this.document.items.filter(i => i.type === "sort" && i.system.isDefault == true)
    const defaultArme = this.document.items.filter(i => i.type === "arme" && i.system.isDefault == true)

    let sortToAdd = [];
    if(defaultSorts.filter(i => i.system.level == 1).length == 0)
    {
      sortToAdd.push({type: "sort", name: game.i18n.format("beryllium.libelle.sortdefaut.mineur"), system: {level: 1, isDefault: true}});
    }
    if(defaultSorts.filter(i => i.system.level == 2).length == 0)
    {
      sortToAdd.push({type: "sort", name: game.i18n.format("beryllium.libelle.sortdefaut.intermediaire"), system: {level: 2, isDefault: true}});
    }
    if(defaultSorts.filter(i => i.system.level == 3).length == 0)
    {
      sortToAdd.push({type: "sort", name: game.i18n.format("beryllium.libelle.sortdefaut.majeur"), system: {level: 3, isDefault: true}});
    }
    
    if(defaultArme.length == 0)
    {
      this.actor.createEmbeddedDocuments("Item", [{type: "arme", name: game.i18n.format("beryllium.libelle.armedefaut.poing"), system: {isDefault: true}}]);
    }

    if(sortToAdd.length > 0)
    {
      this.actor.createEmbeddedDocuments("Item", sortToAdd);
    }

    return context;
  }

  _onRender(context, options) {
    if(options.isFirstRender)
    {
      this.checkDefaultItems(context);
    }
    super._onRender(context, options);
    
  }

  static async _onAttaque(event, target){
    event.preventDefault();
    
    const actor = this.document;
    const competence = target.dataset.competence;
    const item = target.dataset.itemid;
    const type = target.dataset.competence == "magie" ? "magie" : "arme";

    if([...game.user.targets].length == 0) {
        return ui.notifications.error(game.i18n.format("beryllium.attaquedefense.attaque.notarget"));
    }

    const itemObj = actor.items.get(item);
    const needMunitions = (itemObj.type == "arme" && (itemObj.system.typeMunition||"") != "");

    const modificateurs = await system.DiceRoller.AttaqueRollDialog.create({
      isMagie: (competence == "magie"), 
      competences: actor.system.competences, 
      item: itemObj, 
      type: type, 
      needMunitions: needMunitions,
      munitions: needMunitions ? actor.items.filter(i => i.type == "munition" && i.system.typeMunition == itemObj.system.typeMunition) : null,
    });

    if (modificateurs == null) { return; }
    
    if(itemObj.type == "arme" && itemObj.system.typeQte == "jet") {
      if(modificateurs.quantite < 0)
      {
        return ui.notifications.error(game.i18n.format("beryllium.attaquedefense.attaque.qteless"));
      }
      if(modificateurs.quantite > itemObj.system.quantiteConso.value)
      {
        return ui.notifications.error(game.i18n.format("beryllium.attaquedefense.attaque.qtemore"));
      }
    }

    let myItem = {
          id: itemObj.id,
          name: itemObj.name,
          type: type,
          degats: itemObj.system.degat,
        };

    let munition = null;
    if(needMunitions) {
      munition = actor.items.get(modificateurs.munition);

      myItem.name += "(" + munition.name + ")";
      
      myItem.degats += munition.system.degat;


      if(modificateurs.quantite < 0) {
        return ui.notifications.error(game.i18n.format("beryllium.attaquedefense.attaque.qteless"));
      }
      
      if(modificateurs.quantite > munition.system.quantiteConso.value)
      {
        return ui.notifications.error(game.i18n.format("beryllium.attaquedefense.attaque.qtemore"));
      }
    }

    let coutFletrine = 0;
    if(competence == "magie")
    {
      coutFletrine = modificateurs.coutFletrine;
    }


    const myRoll = new system.DiceRoller.AttaqueRoll("4db",{}, {
        competence: competence,
        item: myItem,
        actorCompetence: actor.system.competences[modificateurs.competence], 
        modificateurs: modificateurs, 
        from: actor,
        coutFletrine: coutFletrine,
        scene: game.scenes.current.id,
        targets: [...game.user.targets].reduce(function(r, t) {
            r[t.id] = { 
              id: t.document.id, 
              uuid: t.document.uuid, 
              actorId: t.document.actorId, 
              name:t.document.delta.name || t.document.name, 
              result: null,
            };
            return r;
        }, {}),
    });

    await myRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ alias: actor.name + " ( " + game.user.name + " )"}),
    });

    if(itemObj.type == "arme" && itemObj.system.typeQte == "jet" && modificateurs.quantite > 0) {
      itemObj.update({"system.quantiteConso.value": itemObj.system.quantiteConso.value - modificateurs.quantite});
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: this.document.name }),
        content: game.i18n.format("beryllium.attaquedefense.attaque.itemRetires", {item: itemObj.name, nb: modificateurs.quantite}),
      });
    } else if(needMunitions && modificateurs.quantite > 0) {
      munition.update({"system.quantiteConso.value": munition.system.quantiteConso.value - modificateurs.quantite});
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: this.document.name }),
        content: game.i18n.format("beryllium.attaquedefense.attaque.itemRetires", {item: munition.name, nb: modificateurs.quantite}),
      });
    }
  }
  
  static async _onSkillRoll(event, target){
    event.preventDefault();

    const actor = this.document;
    const competence =  target.dataset.competence;

    const modificateurs = await system.DiceRoller.CompetenceRollDialog.create({
      isMagie: (competence == "magie"), 
    });
    if (modificateurs == null) { return; }

    
    let coutFletrine = 0;
    if(competence == "magie")
    {
      coutFletrine = modificateurs.coutFletrine;
    }


    const myRoll = new system.DiceRoller.CompetenceRoll("4db",{}, {
        competence: competence, 
        actorCompetence: actor.system.competences[competence], 
        modificateurs: modificateurs,
        coutFletrine: coutFletrine,
        actor: {
          competence: actor.system.competences[competence],
          obj: actor,
        }
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });

  }

  static async _onToggle(event, target) {
    this.element.querySelectorAll("[data-toggle_section='" + target.dataset.toggle + "']").forEach(e => e.classList.toggle("visible"));
    //--TODO: ajouter changement icone
  }


  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "arme" || item.type == "armure" || item.type == "sort" || item.type == "objet" || item.type == "munition" || item.type == "aspect")
        {
          super._onDrop(event);

        }
    }
  }

  static async _onAddRemove(event, target) {
    event.preventDefault()
    if(foundry.utils.getProperty(this.actor.system, target.dataset.item).value  != undefined)
    {
      const update = {};
      update["system." + target.dataset.item + ".value"] = foundry.utils.getProperty(this.actor.system, target.dataset.item).value + (target.dataset.sens == "+" ? 1 : -1);
      await this.actor.update(update)
    }
  }
  
  static async _onAddItem(event, target) {
    event.preventDefault();
    const type = target.dataset.type;
    
    const itemData = {
      name: type,
      type: type,
      system: {}
    };
    
    // Créer l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("Item", [itemData], { render: true });
    if (created && created[0]) {
      created[0].sheet.render(true, { force: true });
    }
    
    return created;
  }
  
  static async _onEditItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);
    if (item) {      
      if (item.sheet.rendered) {
        item.sheet.bringToTop();
      } else {
        item.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteItem(event, target) {
    event.preventDefault();
    const item = this.document.items.get(target.dataset.itemid);

    if (item) {
      if(item.system.isDefault == true)
      {
        ui.notifications.error(`Vous ne pouvez pas supprimer ${item.name}, c'est un élément de base.`);
        return;
      }

      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await system.Common.Dialog.confirm({
          content: `<p>Êtes-vous sûr de vouloir supprimer ${item.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await item.delete({ render: true });
        ui.notifications.info(`${item.name} supprimé(e)`);
      }
    }
  }  

  static async _onRepos(event, target) {
    const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dialog/repos.hbs");

    const dialog = await system.Common.Dialog.input({
      content: html,
      position: {
       width: 550,
       height: 620,
      },
      window: {title: "Repos"},
      ok: {
          label: game.i18n.format("beryllium.messages.repos.oklabel"),
          default: true,
          icon: "fa-solid fa-bed",
      }
    });

    if(!dialog) { return;}

    let modifs = {
      messageTitre: "",
      messages: {},
      updates: {},
    };

    if(dialog.typeRepos == "session") {
      modifs = this.repos_session(this.document, modifs);
    } else if(dialog.typeRepos == "court") {
      modifs = this.repos_court(this.document, modifs);
    } else if(dialog.typeRepos == "long") {
      modifs = this.repos_long(this.document, modifs);
    } else if(dialog.typeRepos == "scenario") {
      modifs = this.repos_scenario(this.document, modifs);
    }

    
    if(modifs.messageTitre !== "")  {

      this.document.update(modifs.updates);

      let messageContent = "<h3>" + modifs.messageTitre + "</h3>";
      messageContent += "<div>" + game.i18n.format("beryllium.messages.repos.recup") + "</div>";
      messageContent += Object.values(modifs.messages).map(e => "<div>" + e + "</div>").join("");

      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: this.document.name }),
        content: messageContent,
      });
    }
  }

  repos_court(actor, modifs) {
    //modifs = this.repos_combat(actor, modifs);

    modifs.messageTitre = game.i18n.format("beryllium.messages.repos.court.message", {actor: actor.name});

    modifs.updates["system.stress.value"] = 0;
    modifs.messages["a1stress"] = game.i18n.format("beryllium.messages.repos.elements.stress", {nb: actor.system.stress.value});

    modifs.updates["system.consequences.legere.values"] = [];
    modifs.messages["z1consequenceslegeres"] = game.i18n.format("beryllium.messages.repos.elements.consequenceslegeres");
    
    modifs.updates["system.magie.fletrine.value"] = actor.system.magie.fletrine.value - 1;
    modifs.messages["a2fletrine"] = game.i18n.format("beryllium.messages.repos.elements.fletrine", {nb: Math.min(1, actor.system.magie.fletrine.value)});
    return modifs;
  }

  repos_long(actor, modifs) {
    modifs = this.repos_court(actor, modifs);
    modifs.messageTitre = game.i18n.format("beryllium.messages.repos.long.message", {actor: actor.name});

    modifs.updates["system.consequences.modere.values"] = [];
    modifs.messages["z2consequencesmoderes"] = game.i18n.format("beryllium.messages.repos.elements.consequencesmoderes");

    modifs.updates["system.oubli.value"] =  actor.system.oubli.value +1;
    modifs.messages["a3oubli"] = game.i18n.format("beryllium.messages.repos.elements.oubli", { nb: actor.system.oubli.value >= actor.system.nbCasesOubliTotal ? 0 : 1});

    modifs.updates["system.magie.fletrine.value"] = actor.system.magie.fletrine.value - 5;
    modifs.messages["a2fletrine"] = game.i18n.format("beryllium.messages.repos.elements.fletrine", { nb: Math.min(5, actor.system.magie.fletrine.value)});
      
    return modifs;
  }

  repos_session(actor, modifs) {

    modifs.messageTitre = game.i18n.format("beryllium.messages.repos.session.message", {actor: actor.name});

    actor.system.heritage.utilisationPrivilege.forEach((v, k) => {
      modifs.updates["system.heritage.utilisationPrivilege." + k + ".value"] = 0;
    });
    modifs.messages["d1privileges"] = game.i18n.format("beryllium.messages.repos.elements.privileges");

    return modifs;
  }

  repos_scenario(actor, modifs) {
    modifs = this.repos_long(actor, modifs);
    modifs.messageTitre = game.i18n.format("beryllium.messages.repos.scenario.message", {actor: actor.name});

    modifs.updates["system.consequences.grave.values"] = [];
    modifs.messages["z3consequencesgraves"] = game.i18n.format("beryllium.messages.repos.elements.consequencesgraves");

    modifs.updates["system.magie.fletrine.value"] = 0;
    modifs.messages["a2fletrine"] = game.i18n.format("beryllium.messages.repos.elements.fletrine", { nb: actor.system.magie.fletrine.value});

    modifs.updates["system.oubli.value"] =  actor.system.nbCasesOubliTotal;
    modifs.messages["a3oubli"] = game.i18n.format("beryllium.messages.repos.elements.oubli", { nb: actor.system.nbCasesOubliTotal - actor.system.oubli.value});

    modifs.updates["system.echo.value"] =  actor.system.nbCasesEchoTotal;
    modifs.messages["a3echo"] = game.i18n.format("beryllium.messages.repos.elements.echo", { nb: actor.system.nbCasesEchoTotal - actor.system.echo.value});

    return modifs;
  }

  static async _onDepense(event, target) {
    const dialog = await system.Common.Dialog.input({
      content: await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dialog/depense.hbs"),
      window: {title: "Dépense"},
      ok: {
          label: "Claque ta tune",
          default: true,
          icon: "fa-solid fa-coins",
      },
      submit: result => {
        ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
          content: "fait peter la tune",
        });
      }
    });
  }

  static async _onDeInterference(event, target) {
    const modificateurs = await system.DiceRoller.InterferenceRollDialog.create();
    if (modificateurs == null) { return; }

    const myRoll = new system.DiceRoller.InterferenceRoll("1d12>9",{}, {
      modificateurs: modificateurs
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });

  } 

  static async _onUsePrivilege(event, target) {
    let uses = this.actor.system.heritage.utilisationPrivilege;

    if(uses[target.dataset.privilegeid].value >= uses[target.dataset.privilegeid].max) {
      ui.notifications.error(game.i18n.format("beryllium.messages.usePrivilege.error"));
      return;
    }

    uses[target.dataset.privilegeid].value = uses[target.dataset.privilegeid].value + 1;
    const update = {};
    update["system.heritage.utilisationPrivilege"] = uses;
    await this.actor.update(update)

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
      content: game.i18n.format("beryllium.messages.privilege.utilisation", {actor: this.actor.name, privilege: system.Objet.Cultures.get(this.actor.system.culture).privileges[target.dataset.privilegeid].titre}),
    });
  } 

  static async _onManagePrivilege(event, target) {
    let uses = this.actor.system.heritage.utilisationPrivilege;

    const dialog = await system.Common.Dialog.input({
      content: await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dialog/changeUsePrivilege.hbs", {use: uses[target.dataset.privilegeid]}),
      window: {title: game.i18n.format("beryllium.messages.managePrivilege.dialog.title")},
      ok: {
          label: game.i18n.format("beryllium.messages.managePrivilege.dialog.oklabel"),
          default: true,
          icon: "fa-solid fa-save",
      },
      submit: result => {
        uses[target.dataset.privilegeid].value = result.newNbUtils;
        const update = {};
        update["system.heritage.utilisationPrivilege"] = uses;
        this.actor.update(update)
      }
    });
  } 

  static async _onEquipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": true});
  } 

  static async _onDesequipeArmure(event, target) {
    this.actor.items.get(target.dataset.itemid).update({"system.isEquipe": false});
  } 

  static async _onJetSortieSurchauffe(event, target) {
    const competence = "volonte";
    const myRoll = new system.DiceRoller.SortieSurchauffeRoll("4db",{}, {
      actor: {
        uuid: this.actor.uuid,
      },
      competence: competence,
      competenceValue: this.document.system.competences[competence].value,
      seuil: 2,
    });

    await myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });    
  }   


  static async _onDeOubli(event, target) {
    if(this.actor.system.oubli.value <= 0) {
      ui.notifications.error(game.i18n.format("beryllium.messages.oubli.errorVide"));
      return;
    }

    const modificateurs = await system.DiceRoller.OubliRollDialog.create();
    if (modificateurs == null) { return; }

    const actor = this.document;
    const myRoll = new system.DiceRoller.OubliRoll("4db",{}, {
      seuil: modificateurs.difficulte,
      actor: {
        competencepri: actor.system.competences["volonte"],
        competencesec: actor.system.competences[modificateurs.competence],
        obj: actor,
        uuid: actor.uuid,
      }
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });
  }  
   
  static async _onUtilisationProuesse(event, target) {
    if(this.actor.system.echo.value <= 0) {
      ui.notifications.error(game.i18n.format("beryllium.messages.echo.errorVide"));
      return;
    }

    const prouesse = this.actor.system.prouesses.values[target.dataset.prouesseid];
    
    if(prouesse.isActif) {
      await this.actor.update({"system.echo.value" : this.actor.system.echo.value - 1});
    }    

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
      content: game.i18n.format("beryllium.messages.echo.utilisationProuesse", {actor: this.actor.name, prouesse: prouesse.nom}),
    });
  }

  static async _onAddEffet(event, target) {
    event.preventDefault();
    
    const effetData = {
      name: "Effet",
      type: "effet",
      system: {}
    };
    
    // Créer l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("ActiveEffect", [effetData], { render: true });
    if (created && created[0]) {
      created[0].sheet.render(true, { force: true });
    }
    
    return created;
  }
  
  static async _onEditEffet(event, target) {
    event.preventDefault();
    const effet = this.document.effects.get(target.dataset.effet);
    if (effet) {      
      if (effet.sheet.rendered) {
        effet.sheet.bringToTop();
      } else {
        effet.sheet.render(true, { force: true });
      }
    }
  }
  
  static async _onDeleteEffet(event, target) {
    event.preventDefault();
    const effet = this.document.effects.get(target.dataset.effet);

    if (effet) {
      
      let confirmed = false;

      if(event.ctrlKey && event.shiftKey)
      {
        confirmed = true;
      }
      else
      {
        confirmed = await system.Common.Dialog.confirm({
          content: `<p>Êtes-vous sûr de vouloir supprimer ${effet.name}?</p>`,
          rejectClose: false,
          modal: true
        });
      }

      if (confirmed) {

        await effet.delete({ render: true });
        ui.notifications.info(`${effet.name} supprimé(e)`);
      }
    }
  }  

  static async onShowAllEffets(event, target) {
    system.Actor.getActorEffets(this.document);
  }
  
}