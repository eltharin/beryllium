



export class BaseItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    actions: {

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

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.system = this.document.system;
    

    return context
  }
}