


export class DefenseChoixTokenDialog {
    static async create(options = {}) {

        let data = {
            tokens : options.avaiableTargets
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/defense-choixToken-dialog.hbs", data);

        return new Promise((resolve) => {
            const dialog = foundry.applications.api.DialogV2.input({
                content: html,
                window: {title: "Choix de la cible"},
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