
import {TypeMunitionConfig} from "./TypeMunition.mjs"

export function registerSettings()
{
    game.settings.register("beryllium", "typeMunition", {
        name: "beryllium.settings.typemunition.label",
        scope: "world",
        config: false,
        type: Object,
        default: ["fleche", "carreau", "balle"]
    });

    game.settings.registerMenu("beryllium", "typeMunition", {
        name: "beryllium.settings.typemunition.label",
        label: "beryllium.settings.typemunition.btn",
        hint: "beryllium.settings.typemunition.hint",
        scope: "world",
        restricted: true,
        type: TypeMunitionConfig,
    });
}