


export class CompetenceRollDialog {
    static async create(options = {}) {
        let data = {
            options: {
                difficulteDefaut: 4,
                difficulte: {
                    mediocre: {
                        value: 0,
                        isDefault: false
                    },
                    correct: {
                        value: 2,
                        isDefault: false
                    },
                    moyen: {
                        value: 4,
                        isDefault: true
                    },
                    bon: {
                        value: 6,
                        isDefault: false
                    },
                    excellent: {
                        value: 8,
                        isDefault: false
                    },
                    legendaire: {
                        value: 10,
                        isDefault: false
                    }
                }
            }
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/competence/roll-dialog.hbs", data);

        return new Promise((resolve) => {
            const dialog = foundry.applications.api.DialogV2.input({
                content: html,
                window: {title: "lancer de dé"},
                ok: {
                    label: "Make Choice",
                    default: true,
                    icon: "fa-solid fa-floppy-disk",
                },
                submit: result => {
                    resolve(result);
                }
            });
        });
    }
}