


export class OubliRollDialog {
    static async create(options = {}) {

        let data = {
            options: {
                difficulte: {
                    n02: {
                        value: 2,
                        isDefault: true
                    },
                    n04: {
                        value: 4,
                        isDefault: false
                    },
                    n06: {
                        value: 6,
                        isDefault: false
                    },
                    n08: {
                        value: 8,
                        isDefault: false
                    },
                    n10: {
                        value: 10,
                        isDefault: false
                    }
                },      
                competences: {
                    erudition: "erudition",
                    perception: "perception",
                    technique: "technique",
                }
            }
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/oubli/roll-dialog.hbs", data);

        return await foundry.applications.api.DialogV2.input({
            content: html,
            window: {title: game.i18n.format("beryllium.roll.common.rolldice")},
            ok: {
                label: game.i18n.format("beryllium.roll.oubli.dialog.button"),
                default: true,
                icon: "fa-solid fa-floppy-disk",
            }
        });
    }
}