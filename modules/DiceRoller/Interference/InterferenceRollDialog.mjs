


export class InterferenceRollDialog {
    static async create(options = {}) {

        let data = {
            isMagie: options.isMagie,
            options: {
                difficulte: {
                    standard: {
                        value: 1,
                        isDefault: true
                    },
                    eleve: {
                        value: 2,
                        isDefault: false
                    },
                    extreme: {
                        value: 3,
                        isDefault: false
                    }
                }
            }
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/interference/roll-dialog.hbs", data);

        return new Promise((resolve) => {
            const dialog = foundry.applications.api.DialogV2.input({
                content: html,
                window: {title: game.i18n.format("beryllium.roll.common.rolldice")},
                ok: {
                    label: game.i18n.format("beryllium.roll.interference.dialog.button"),
                    default: true,
                    icon: "fa-solid fa-floppy-disk",
                    //callback: (event, button, dialog) => (console.log(event, button, dialog))
                },
                submit: result => {
                    resolve(result);
                }
            });
        });
    }
}