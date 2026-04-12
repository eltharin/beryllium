import {merge} from "../Helper/_helpers.mjs"


export function BaseSheet(BaseApplication) {
  
    class BaseSheetClass extends foundry.applications.api.HandlebarsApplicationMixin(
        BaseApplication
    ) {
        constructor(options) {
            super(options);
        }

        static ACTIONS = {
        };

        static DEFAULT_OPTIONS = {
            actions: {
                ...this.ACTIONS,
            }
        };


    }
    return BaseSheetClass;
}