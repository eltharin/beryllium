


export class TypeMunitionConfig extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/settings/typemunition.hbs"
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
        handler: this.#onSubmitForm,
        closeOnSubmit: false,
        submitOnChange: true
    },
    position: {
      width: 770,
      height: 550,
    },
    window: {
      resizable: true,
      controls: [

      ]
    },
  }

  async _prepareContext() {
    return {
      list: game.settings.get("beryllium", "typeMunition") ?? []
    };
  }

  static async #onSubmitForm(event, form, formData) {
    event.preventDefault()
    await game.settings.set("beryllium", "typeMunition", Object.values(formData.object).filter(e => e != ""))
    this.render();
  }
}