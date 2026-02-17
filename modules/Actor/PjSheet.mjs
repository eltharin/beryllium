import {DiceRoller} from "../DiceRoller/DiceRoller.mjs";


export class PjSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static PARTS = {
    template: { template: "systems/beryllium/templates/pj-sheet.hbs" }
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    context.system = this.actor.system  // Note: this.actor for ActorSheetV2
    context.flags = this.actor.flags     // or this.document for ApplicationV2

    return context
  }

  _onRender(context, options) {
    super._onRender(context, options);

    this._activateSkillRolls();
  }

  _activateSkillRolls() {
    this.element.querySelectorAll('.pj-sheet .competences label').forEach(label => {
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
}