

export class ArmureSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {
  static PARTS = {
    form: { 
      template: "systems/beryllium/templates/item/armure.hbs",
    },
  };

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    },
    actions: {

    },
    position: {
      width: 950,
      height: 800,
    },
    window: {
      resizable: true,
      controls: [

      ]
    },
  }
}