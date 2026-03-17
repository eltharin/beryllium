


export class DefenseChoixTokenDialog {
    static async create(options = {}) {
        let data = {
            tokens : options.avaiableTargets.map(t => {return {
                id: t.id,
                name: t.delta.name || t.name
            };})
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/defense/choixToken-dialog.hbs", data);

        return await foundry.applications.api.DialogV2.input({
            content: html,
            window: {title: "Choix de la cible"},
            ok: {
                label: "Défendre",
                default: true,
                icon: "fa-solid fa-floppy-disk",
            }
        });
    }
}