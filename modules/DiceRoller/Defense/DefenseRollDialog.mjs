


export class DefenseRollDialog {
    static async create(options = {}) {
console.log(options)
console.log(options.token.actor.system.competences)

        let data = {
            competences: {
                combat:   "Combat (" + options.token.actor.system.competences["combat"].value + ")",
                physique: "Physique (" + options.token.actor.system.competences["physique"].value + ")",
                discretion: "Volonté (" + options.token.actor.system.competences["volonte"].value + ")",
                magie: "Magie (" + options.token.actor.system.competences["magie"].value + ")",
            }
        };

        console.log(data)

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/defense-roll-dialog.hbs", data);

        return new Promise((resolve) => {
            const dialog = foundry.applications.api.DialogV2.input({
                content: html,
                window: {title: "lancer de dé"},
                ok: {
                    label: "Défendre",
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