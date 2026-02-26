import {DiceRoller} from "../../DiceRoller/DiceRoller.mjs";
import {Cultures} from "../../Objet/Cultures.mjs";
import {Magies} from "../../Objet/Magies.mjs";
import * as Helpers from "../../Helper/_helpers.mjs";


export class PjSheet extends foundry.applications.api.HandlebarsApplicationMixin(
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
      lanceSort: this._onLanceSort,
      repos: this._onRepos,
      depense: this._onDepense,
      attaque: this._onAttaque,
      deInterference: this._onDeInterference,
      //deleteItem: PjSheet.deleteDroppedItem,
      //configurePrototypeToken: (any, event) => {console.log(any, event);},
      //configureToken: (any) => {console.log(any);},
      //showPortraitArtwork: (any, event) => {console.log(any, event);},
      //showTokenArtwork: (any, event) => {console.log(any, event);},
    },
    position: {
      width: 950,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [
       /* {
          action: "showArtwork",
          icon: "fa-solid fa-lock",
          label: "beryllium.pjsheet.action.showArtwork",
          ownership: "OWNER",
        },*/
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
          visible: this.#canVerouillage
        }
      ]
    },
  }

  static #showArtwork(event, target) {
    console.log(target)
    new foundry.applications.apps.ImagePopout({
      src: target.getAttribute("src"),
      uuid: this.actor.uuid,
      window: { title: this.actor.name }
    }).render({ force: true });
  }

  static #canVerouillage() {
    return false && this.isEditable;// && this.actor.isPolymorphed;
  }
  
  verouillage() {
    console.log("verouillage");
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);
    const submitData = foundry.utils.expandObject(formData.object);

    foundry.utils.setProperty(data, "system.argent", Helpers.Argent.convertBtoA(submitData.system.bourse));

    return data ; 
  }

  
  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)

    context.isGm = game.user.isGM;
    context.isPJ = this.constructor.name == "PjSheet";
    
    context.tabs = this._prepareTabs("primary");

    context.system = this.actor.system  // Note: this.actor for ActorSheetV2
    context.flags = this.actor.flags     // or this.document for ApplicationV2

    //-- culture ------------------------------------------------
    context.listes = {};

    context.culture = {
      list: Cultures.list(),
    }
    context.listes.magies = {
      list: Magies.list(),
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

    context.system.cultureobj = Cultures.get(context.system.culture);

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
/*
  _onUpdate(changed, options, userId) {
    console.log(changed, options, userId);
    super._onUpdate(changed, options, userId);
  }

  _onChangeForm(formConfig, event) {
    let data = super._onChangeForm(formConfig, event)
    console.log(data, formConfig, event.currentTarget);
    return data;
  }*/
/*
  _activateSkillRolls() {
    this.element.querySelectorAll('.pj-sheet .pj-sheet-competences .competence label').forEach(label => {
      label.style.cursor = 'pointer';
      label.addEventListener('click', async (event) => {

      });
    });
  }*/

  static async _onAttaque(event, target){
    event.preventDefault();
    // Lancer les dés
    return DiceRoller.attaqueRoll({
      actor: this.document,
      competence: target.dataset.competence,
      //target: game.target
    }); 
  }
  
  static async _onSkillRoll(event, target){
    event.preventDefault();
    // Lancer les dés
    return DiceRoller.competenceRoll({
      actor: this.document,
      competence: target.dataset.competence
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
    console.log(event, data);

    switch(data.type)
    {
      case "Item": 
        const item = fromUuidSync(data.uuid);
        
        if(item.type == "arme" || item.type == "armure" || item.type == "sort" || item.type == "objet")
        {
          super._onDrop(event);

        }
    }
    /*
    
    // Handle different data types
    switch (data.type) {
      case "Item":
        return this._onDropItem(event, data);
      case "Actor":
        return this._onDropActor(event, data);
      case "Folder":
        return this._onDropFolder(event, data);
    }*/
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

  static async _onLanceSort(event, target) {
    console.log("lance sort",event, target);
  }

  static async _onAddItem(event, target) {
    console.log(event, target)
    event.preventDefault();
    const type = target.dataset.type;
    
    const itemData = {
      name: type,
      type: type,
      system: {}
    };
    
    // Créer l'item sans render automatique
    const created = await this.document.createEmbeddedDocuments("Item", [itemData], { render: false });
    if (created && created[0]) {
      // Forcer le re-render de la fiche d'acteur pour afficher le nouvel item
      this.render(false);
      
      // Attendre que le render soit terminé avant d'ouvrir la feuille de l'item
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Ouvrir la feuille du nouvel item
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
    console.log(event)
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
    const dialog = foundry.applications.api.DialogV2.input({
      content: html,
      window: {title: "Repos"},
      ok: {
          label: "Ron Pchi",
          default: true,
          icon: "fa-solid fa-floppy-disk",
      },
      submit: result => {
        ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
          content: "veut faire dodo... mais il ne se passe rien car ce connard de dev n'a pas fait la fonctionnalité encore.",
        });
      }
    });
  }

  static async _onDepense(event, target) {

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
    return DiceRoller.interferenceRoll({
      actor: this.document,
    }); 
  } 
}