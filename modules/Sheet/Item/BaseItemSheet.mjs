



export class BaseItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {

  async _prepareContext(options) {
    
    const context = await super._prepareContext(options)
    context.system = this.document.system;
    

    return context
  }
}