


export class AttaqueRollDialog {
    static async create(options = {}) {

        console.log(Object.keys(options.competences).reduce(function(result, key) {
                result[key] = options.competences[key].value;
                return result
            }, {}));

        let data = {
            isMagie: options.isMagie,
            competences: {
            },
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

        if(options.isMagie) {
            data.competences = {magie: "Magie (" + options.competences["magie"].value + ")"};
        } else {
            data.competences = {
                combat:   "Combat (" + options.competences["combat"].value + ")",
                physique: "Physique (" + options.competences["physique"].value + ")",
                discretion: "Discrétion (" + options.competences["discretion"].value + ")",
            };
        }

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/attaque-roll-dialog.hbs", data);

        return new Promise((resolve) => {
            const dialog = foundry.applications.api.DialogV2.input({
                content: html,
                window: {title: "lancer de dé"},
                ok: {
                    label: "Attaquer",
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