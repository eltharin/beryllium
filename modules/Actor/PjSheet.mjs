import {DiceRoller} from "../DiceRoller/DiceRoller.mjs";


export class PjSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/actor/pj/pj-sheet.hbs",
      templates: [
        'systems/beryllium/templates/actor/pj/topbar.hbs',
        'systems/beryllium/templates/actor/pj/sidebar.hbs',
        'systems/beryllium/templates/actor/pj/aspects.hbs',
        'systems/beryllium/templates/actor/pj/heritage.hbs',
        'systems/beryllium/templates/actor/pj/prouesses.hbs',
        'systems/beryllium/templates/actor/pj/consequences.hbs',
        'systems/beryllium/templates/actor/pj/resistance.hbs',
        'systems/beryllium/templates/actor/pj/equipements.hbs',
        'systems/beryllium/templates/actor/pj/notes.hbs',
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
      addRemoveSegment: PjSheet._onAddRemoveSegment,
      addRemoveStress: PjSheet._onAddRemoveStress,
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
      controls: [        {
          action: "verouillage",
          icon: "fa-solid fa-backward",
          label: "DND5E.TRANSFORM.Action.Restore",
          ownership: "OWNER",
          visible: this.#canVerouillage
        }]
    },
    dragDrop: [{ dragSelector: ".item", dropSelector: null }]
  }

  static #canVerouillage() {
    return this.isEditable;// && this.actor.isPolymorphed;
  }
  
  verouillage() {
    console.log("verouillage");
  }

  _prepareSubmitData(event, form, formData, updateData) { 

    let data  = super._prepareSubmitData(event, form, formData, updateData);

    //console.log(event, form, formData, updateData);


    return data ; 
  }

  getNbCase(value, forcemax) {
    if(forcemax != -1){
      return forcemax;
    }
    else if(value >= 4) {
      return 4;
    }
    else if(value >= 2) {
      return 3;
    }
     
    return 2;
  }
  
  async _prepareContext(options) {
    console.log("_prepareContext");
    console.log(options);

    const context = await super._prepareContext(options)
    context.tabs = this._prepareTabs("primary");

    context.system = this.actor.system  // Note: this.actor for ActorSheetV2
    context.flags = this.actor.flags     // or this.document for ApplicationV2


    context.stress = {
      valcheck : context.system.stress.value,
      valnoncheck : this.actor.system.nbCasesStressTotal - context.system.stress.value,
    }

    console.log(context.stress);

    context.fletrine = {};

    let restValue = context.system.magie.fletrine.value;

    context.system.magie.fletrine.niveaux.forEach((niv,key) => {

      let valUtil = Math.min(restValue, niv.max);
      restValue = restValue - valUtil;

      context.fletrine[key] = {
        label : game.i18n.format("beryllium.label.niv") + (key+1),
        nbCheck: valUtil,
        nbNoncheck : niv.max - valUtil,
        isMax: niv.max == valUtil
      }
    });



    
    return context
  }

  _onRender(context, options) {
    super._onRender(context, options);
    this._activateSkillRolls();

    this._manageTab();
  }

  _onUpdate(changed, options, userId) {
    console.log(changed, options, userId);
    super._onUpdate(changed, options, userId);
  }

  _onChangeForm(formConfig, event) {
    let data = super._onChangeForm(formConfig, event)
    console.log(data, formConfig, event.currentTarget);
    return data;
  }

  _activateSkillRolls() {
    this.element.querySelectorAll('.pj-sheet .pj-sheet-competences .competence label').forEach(label => {
      label.style.cursor = 'pointer';
      label.addEventListener('click', async (event) => {
        event.preventDefault();
        // Lancer les dés
        return await DiceRoller.competenceRoll({
          actorName: this.document.name,
          competence: event.target.closest('div').dataset.competence
        });
      });
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


  static async _onAddRemoveSegment(event, target) {
    event.preventDefault()
    console.log(event, target, this.actor, target.dataset.sens)
    await this.actor.update({"system.magie.fletrine.value" : this.actor.system.magie.fletrine.value + (target.dataset.sens == "+" ? 1 : -1)})
  }

  static async _onAddRemoveStress(event, target) {
    event.preventDefault()
    console.log(event, target, this.actor, target.dataset.sens)
    await this.actor.update({"system.stress.value" : this.actor.system.stress.value + (target.dataset.sens == "+" ? 1 : -1)})
  }
  
}