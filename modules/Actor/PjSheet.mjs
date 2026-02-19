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
      //deleteItem: PjSheet.deleteDroppedItem,
      //configurePrototypeToken: (any, event) => {console.log(any, event);},
      //configureToken: (any) => {console.log(any);},
      //showPortraitArtwork: (any, event) => {console.log(any, event);},
      //showTokenArtwork: (any, event) => {console.log(any, event);},
      totoeditImage: (any, event) => {console.log(any, event);},
    },
    position: {
      width: 950,
      height: 800,
    },
    window: {
      resizable: true
    },
    dragDrop: [{ dragSelector: ".item", dropSelector: null }]
  }

  static async #onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document._source, attr);
    const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
    const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
    console.log("coucuo");
    const fp = new CONFIG.ux.FilePicker({
      current,
      type: target.dataset.type,
      redirectToRoot: defaultImage ? [defaultImage] : [],
      callback: path => {
        console.log(path);

        const isVideo = foundry.helpers.media.VideoHelper.hasVideoExtension(path);
        if ( ((target instanceof HTMLVideoElement) && isVideo) || ((target instanceof HTMLImageElement) && !isVideo) ) {
          target.src = path;
          console.log(path);
        } else {
          const repl = document.createElement(isVideo ? "video" : "img");
          Object.assign(repl.dataset, target.dataset);
          if ( isVideo ) Object.assign(repl, {
            autoplay: true, muted: true, disablePictureInPicture: true, loop: true, playsInline: true
          });
          repl.src = path;
          console.log(target);
          console.log(repl);
          target.replaceWith(repl);
        }
        this._onEditPortrait(attr, path);
         console.log("coucou", attr, path);
      },
      position: {
        top: this.position.top + 40,
        left: this.position.left + 10
      }
    });
    await fp.browse();
  }

  static async deleteDroppedItem(event, target) {

  }

   _prepareSubmitData(event, form, formData, updateData) { 
    // formData contient toutes les valeurs du formulaire 
    // // Tu peux les modifier avant le submit 

    console.log(formData)
    console.log(this.document.img)
    console.log(this.document.src)
    
/*
    formData.set("system.stress.physique.value", 2);
    formData.set("system.stress.mental.value", 2);
    formData.set("system.stress.magie.value", 2);
 */
    
    formData.set("system.stress.physique.max", Math.floor(formData.get("system.competences.physique.value")/2));
    formData.set("system.stress.mental.max", Math.floor(formData.get("system.competences.volonte.value")/2));
    formData.set("system.stress.magie.max", Math.floor(formData.get("system.competences.magie.value")/2));

    let data  = super._prepareSubmitData(event, form, formData, updateData);

    console.log(event, form, formData, updateData);


    return data ; 
  }


  async _prepareContext(options) {
    console.log("_prepareContext");
    console.log(options);

    const context = await super._prepareContext(options)

    console.log(context.toto ?? null);
    console.log(options.toto ?? null);
    console.log(this.document.toto ?? null);
    context.toto = context.toto ? (context.toto+1) : 1;
    this.document.toto = this.document.toto ? (this.document.toto+1) : 1;

    options.toto = options.toto ? (options.toto+1) : 1;

    context.system = this.actor.system  // Note: this.actor for ActorSheetV2
    context.flags = this.actor.flags     // or this.document for ApplicationV2

    context.stressmax = {
      physique: Math.floor(context.system.competences.physique.value/2),
      mental: Math.floor(context.system.competences.volonte.value/2),
      magie: Math.floor(context.system.competences.magie.value/2),
    }

    context.stress = {
      physique: {
        valcheck: context.system.stress.physique.value,
        valnoncheck: context.system.stress.physique.max - context.system.stress.physique.value,
      },
      mental: {
        valcheck: context.system.stress.mental.value,
        valnoncheck: context.system.stress.mental.max - context.system.stress.mental.value,
      },
      magie: {
        valcheck: context.system.stress.magie.value,
        valnoncheck: context.system.stress.magie.max - context.system.stress.magie.value,
      }
    }
    //context.tabs = this._prepareTabs("primary");

    return context
  }

  async _preparePartContext(partId, context) {
    
    console.log(" _preparePartContext", partId);

  switch (partId) {
    case 'aptitudes':
    case 'traits':
      context.tab = context.tabs[partId];
      break;
    default:
  }
  return context;
}

  _onRender(context, options) {
    super._onRender(context, options);

    this._activateSkillRolls();
    this._activateStressButton();
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

  _activateStressButton() {
    this.element.querySelectorAll('.pj-sheet .stress .updateStress').forEach(label => {
      label.style.cursor = 'pointer';
      label.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log(event.target);
        
        let submitData = {};

        if(event.target.dataset.steesssens == "+"){
          if(this.document.system.stress[event.target.dataset.stress].value >= this.document.system.stress[event.target.dataset.stress].max)
          {
            return;
          }
        }
        else {
          if(this.document.system.stress[event.target.dataset.stress].value <= 0)
          {
            return;
          }
        }
        submitData["system.stress." + event.target.dataset.stress + ".value"] = this.document.system.stress[event.target.dataset.stress].value + (1 * (event.target.dataset.steesssens == "+" ? 1 : -1));
        
        
        
        this.document.update(submitData, { 
          render: true 
        });
      });
    });
  }
}