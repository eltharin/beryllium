

import * as system from "../../_helpers.mjs"

export class DefenseRollDialog {
    static async create(options = {}) {

        let data = {
            competences: {
                combat:   "Combat (" + options.token.actor.system.competences["combat"].value + ")",
                physique: "Physique (" + options.token.actor.system.competences["physique"].value + ")",
                discretion: "Volonté (" + options.token.actor.system.competences["volonte"].value + ")",
                magie: "Magie (" + options.token.actor.system.competences["magie"].value + ")",
            },
            armures: options.token.actor.items.filter(i => (i.type === "armure" && i.system.isEquipe == true)),
            actor: options.token.actor,
        };

        const html = await foundry.applications.handlebars.renderTemplate("systems/beryllium/templates/dice/defense/roll-dialog.hbs", data);

        return await system.Common.Dialog.input({
            content: html,
            render: event => {
                this.calculTotal(event.target, options.attaque.options.competence);
                this.showFletrine(event.target);

                event.target.element.querySelector("form .changeCompetence").addEventListener("change", ev2 => {
                    this.calculTotal(event.target, options.attaque.options.competence);
                    this.showFletrine(event.target);
                }, {passive: true});
                
                event.target.element.querySelectorAll("form .changeArmure").forEach(e => e.addEventListener("change", ev2 => {
                    this.calculTotal(event.target, options.attaque.options.competence);
                }, {passive: true}));
            },
            window: {title: "lancer de dé"},
            ok: {
                label: "Défendre",
                default: true,
                icon: "fa-solid fa-floppy-disk",
            }
        });
    }

    static calculTotal(form, competenceAttaque)
    {
        let totalReductionDegat = 0;
        let totalBonusDefense = 0;
        
        form.element.querySelectorAll(".armure").forEach(armure => {
            const checkbox = armure.querySelector("input[type=checkbox]");
            const reductionDegat = Number(checkbox.dataset["reddeg_" + competenceAttaque] || 0);
            const bonusDefense   = Number(checkbox.dataset["bondef_" + form.element.querySelector("form .changeCompetence").value] || 0);

            if(checkbox.checked)
            {
                totalReductionDegat += reductionDegat;
                totalBonusDefense   += bonusDefense;
            }

            armure.querySelector('.reductionDegat').textContent = reductionDegat;
            armure.querySelector('.bonusDefense').textContent = bonusDefense;
        });

    
        form.element.querySelector('.totalReductionDegat').textContent = totalReductionDegat;
        form.element.querySelector('.totalBonusDefense').textContent = totalBonusDefense;
            
        form.element.querySelector('.inputtotalReductionDegat').value = totalReductionDegat;
    }

    static showFletrine(form)
    {
        form.element.querySelectorAll(".coutFletrine").forEach(flet => {
            flet.style.display = (form.element.querySelector("form .changeCompetence").value == "magie") ? "inherit" : "none";
        });
    }
}