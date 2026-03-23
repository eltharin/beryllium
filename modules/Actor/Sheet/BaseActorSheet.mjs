import * as system  from "../../_helpers.mjs";


export class BaseActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/actor/pj/pj-sheet.hbs",
      templates: [
        'systems/beryllium/templates/actor/pj/parts/topbar.hbs',
        'systems/beryllium/templates/actor/pj/parts/sidebar.hbs',
        'systems/beryllium/templates/actor/pj/parts/aspects.hbs',
        'systems/beryllium/templates/actor/pj/parts/magie.hbs',
        'systems/beryllium/templates/actor/pj/parts/heritage.hbs',
        'systems/beryllium/templates/actor/pj/parts/prouesses.hbs',
        'systems/beryllium/templates/actor/pj/parts/consequences.hbs',
        'systems/beryllium/templates/actor/pj/parts/combat.hbs',
        'systems/beryllium/templates/actor/pj/parts/equipements.hbs',
        'systems/beryllium/templates/actor/pj/parts/notes.hbs',
        'systems/beryllium/templates/actor/pj/parts/max.hbs',
      ] 
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    actions: {
      skillRoll: this._onSkillRoll,
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
      toggleSpecial: this._onToggleSpecial,
      addAspect: this._onAddAspect,
      deleteAspect: this._onDeleteAspect,
    },
    position: {
      width: 950,
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
    
    context.tabs = this._prepareTabs("primary");

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

    context.items = this.document.items.filter(i => i.type === "objet");
    context.armes = {
      default : this.document.items.filter(i => i.type === "arme" && i.system.isDefault == true),
      custom : this.document.items.filter(i => i.type === "arme" && i.system.isDefault == false),
    }
    context.armures = this.document.items.filter(i => i.type === "armure");
    context.sorts = {
      default : this.document.items.filter(i => i.type === "sort" && i.system.isDefault == true),
      custom : this.document.items.filter(i => i.type === "sort" && i.system.isDefault == false),
    };
    context.sorts.default.sort((a,b) => a.system.level > b.system.level ? 1 : -1);
    context.sorts.custom.sort((a,b) => a.system.level > b.system.level ? 1 : -1);



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
    //this._activateSkillRolls();

    this._manageTab();
  }

  static async _onAttaque(event, target){
    event.preventDefault();
    
    const actor = this.document;
    const competence = target.dataset.competence;
    const item = target.dataset.itemid;
    const type = target.dataset.competence == "magie" ? "magie" : "arme";

    if([...game.user.targets].length == 0) {
        return ui.notifications.error(`Il n'y a pas de cible sélectionnée.`);
    }

    const itemObj = actor.items.get(item);
    const modificateurs = await system.DiceRoller.AttaqueRollDialog.create({isMagie: (competence == "magie"), competences: actor.system.competences, item: itemObj, type: type});
    if (modificateurs == null) { return; }
    
    const myRoll = new system.DiceRoller.AttaqueRoll("4db",{}, {
        competence: competence,
        item: {
          id: itemObj.id,
          name: itemObj.name,
          type: type,
          degats: itemObj.system.degat,
        },
        actorCompetence: actor.system.competences[modificateurs.competence], 
        modificateurs: modificateurs, 
        from: actor,
        scene: game.scenes.current.id,
        targets: [...game.user.targets].reduce(function(r, t) {
            r[t.id] = { id: t.document.id, actorId: t.document.actorId, name:t.document.delta.name || t.document.name, result: null};
            return r;
        }, {}),
    });

    myRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ alias: actor.name + " ( " + game.user.name + " )"}),
    });
  }
  
  static async _onSkillRoll(event, target){
    event.preventDefault();

    const actor = this.document;
    const competence =  target.dataset.competence;

    const modificateurs = await system.DiceRoller.CompetenceRollDialog.create();
    if (modificateurs == null) { return; }

    const myRoll = new system.DiceRoller.CompetenceRoll("4db",{}, {
        competence: competence, 
        actorCompetence: actor.system.competences[competence], 
        modificateurs: modificateurs,
        actor: {
          competence: actor.system.competences[competence],
          obj: actor,
        }
    });

    myRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ alias: this.document.name + " ( " + game.user.name + " )"}),
    });

  }

  _manageTab() {
    const selectedTab = this.tabGroups.primary || "aspects";

    this.element.querySelectorAll('.pj-sheet .tab').forEach(tab => {
      if(tab.dataset.tab == selectedTab){
        tab.classList.add("active");
      }
      else {
        tab.classList.remove("active");
      }
    });

    this.element.querySelectorAll('.pj-sheet .sheet-tabs > a').forEach(tab => {
      if(tab.dataset.tab == selectedTab){
        tab.classList.add("active");
      }
      else {
        tab.classList.remove("active");
      }
    });
  }



  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "arme" || item.type == "armure" || item.type == "sort" || item.type == "objet")
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
      if(item.system.isDefault == true)
      {
        ui.notifications.error(`Vous ne pouvez pas supprimer ${item.name}, c'est un élément de base.`);
        return;
      }
      
      // Si la feuille est déjà rendue, juste la mettre au premier plan
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
        confirmed = await foundry.applications.api.DialogV2.confirm({
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

    const dialog = await foundry.applications.api.DialogV2.input({
      content: html,
      position: {
       width: 550,
       height: 600,
      },
      window: {title: "Repos"},
      ok: {
          label: "Ron Pchi",
          default: true,
          icon: "fa-solid fa-floppy-disk",
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
    console.log(modifs);
    return modifs;
  }

  repos_long(actor, modifs) {
    modifs = this.repos_court(actor, modifs);
    modifs.messageTitre = game.i18n.format("beryllium.messages.repos.long.message", {actor: actor.name});

    modifs.updates["system.consequences.modere.values"] = [];
    modifs.messages["z2consequencesmoderes"] = game.i18n.format("beryllium.messages.repos.elements.consequencesmoderes");

    console.log(actor.system.oubli.value, actor.system.nbCasesOubliTotal)

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
    console.log(this, this.constructor.name);
    const dialog = await foundry.applications.api.DialogV2.input({
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

    const dialog = await foundry.applications.api.DialogV2.input({
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

  static async _onToggleSpecial(event, target) {
    this.element.querySelector(".toggleable[data-itemid='" + target.closest(".item").dataset.itemid + "']").classList.toggle("visible");
  }

  static async _onAddAspect(event, target) {
    await this.actor.update({"system.aspects.temporaires" : [...this.actor.system.aspects.temporaires, {nom:""}]});
  }

  static async _onDeleteAspect(event, target) {
    let aspects = this.actor.system.aspects.temporaires;
    aspects.splice(target.dataset.itemid, 1);
    await this.actor.update({"system.aspects.temporaires" : aspects});
  }
}