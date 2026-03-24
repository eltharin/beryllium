
import * as system from "../../_helpers.mjs"


export class AttaqueRollDialog {
    static async create(options = {}) {
        let data = {
            isMagie: options.isMagie,
            item: options.item,
            munitions: options.munitions,
            needMunitions: options.needMunitions,
        };

        if(options.isMagie) {
            data.competences = {magie: "Magie (" + options.competences["magie"].value + ")"};
        } else {
            data.competences = {
                combat:   "Combat (" + options.competences["combat"].value + ")",
                physique: "Physique (" + options.competences["physique"].value + ")",
                discretion: "Discrétion (" + options.competences["discretion"].value + ")",
            };
        }

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/attaque/roll-dialog.hbs", data);

        return await system.Common.Dialog.input({
            content: html,
            window: {title: game.i18n.format("beryllium.attaquedefense.attaque.btn")},
            ok: {
                label: game.i18n.format("beryllium.attaquedefense.attaque.btn"),
                default: true,
                icon: "fa-solid fa-sword",
            }
        });
    }
}