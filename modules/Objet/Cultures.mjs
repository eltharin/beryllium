
class Culture {
    get id(){
        return this._id;
    }
     
    get name(){
        return this.name;
    }

    get modificateurMagie(){
        return this.modificateurMagie;
    }
}


class NaharCulture extends Culture{
    _id = "nahar";
    name = "Nahar";
    modificateurMagie = -1;
    privileges = [
        {titre: "Toujours Équipé ", description: "Disposer d'un petit appareil technologique utile à la situation"}, 
        {titre: "Protocoles de Sécurisation ", description: "Dépenser 1 Point d'Écho pour annuler une Surcharge"}
    ];
    faiblesses = [{description: "Malaise physique (malus temporaire de -1) après exposition prolongée à de fortes manifestations magiques"}];
    specialisations = [{titre: "Ingénierie", base: "technique", bonus: "+1 Technologie naharienne"}];
}

class ArckeneaCulture extends Culture{
    _id = "arckenea";
    name = "Arckénéa";
    modificateurMagie = 0;
    privileges = [{titre: "Liens du Sang", description: "Appeler un membre du clan ou entrer en fureur protectrice pour un allié"}];
    faiblesses = [{description: "Doit relever les défis directs à son honneur ou accepter un aspect temporaire \"Honneur entaché\""}];
    specialisations = [{titre: "Traditions martiales", base: "combat", bonus: "+1 duels formels, défense du clan"}];
}
class BreribForroseCulture extends Culture{
    _id = "breribForrose";
    name = "Brérib - Forrose";
    modificateurMagie = 0;
    privileges = [{titre: "Rumeurs de Cour", description: "Obtenir une information utile via son réseau aristocratique"}];
    faiblesses = [{description: "Mépris instinctif pour les classes inférieures, causant des tensions dans les milieux populaires"}];
    specialisations = [{titre: "Étiquette politique", base: "influence", bonus: "noblesse et institutions"}];
}

class BreribValiaCulture extends Culture{
    _id = "breribValia";
    name = "Brérib - Valia";
    modificateurMagie = 0;
    privileges = [{titre: "Œil de l'Artisan", description: "Identifier la fonction, l'origine ou la valeur exacte d'un objet"}];
    faiblesses = [{description: "Obsession compulsive pour l'amélioration des objets et environnements imparfaits"}];
    specialisations = [{titre: "Artisanat d'excellence", base: "technique", bonus: "créer, réparer, évaluer"}];
}

class BreribAlaocCulture extends Culture{
    _id = "breribAlaoc";
    name = "Brérib - Alaoc";
    modificateurMagie = 0;
    privileges = [{titre: "Mémoire des Pierres", description: "Recevoir une impression intuitive d'un lieu ou objet ancien (le MJ donne un indice)"}];
    faiblesses = [{description: "Inconfort physique (-1) lorsque contraint d'agir contre les cycles naturels"}];
    specialisations = [{titre: "Savoirs anciens", base: "erudition", bonus: "ruines, mégalithes, traditions orales"}];
}

class BreribRuanonCulture extends Culture{
    _id = "breribRuanon";
    name = "Brérib - Ruanon";
    modificateurMagie = 0;
    privileges = [{titre: "Instinct du Prédateur", description: "Identifier la plus grande faiblesse d'un adversaire qu'il peut observer"}];
    faiblesses = [{description: "Tendance à résoudre les conflits par la force, même quand d'autres approches seraient préférables"}];
    specialisations = [{titre: "Tactique militaire", base: "combat", bonus: "coordination, manœuvres défensives"}];
}

class AzsharCulture extends Culture{
    _id = "azshar";
    name = "Azshar";
    modificateurMagie = 0;
    privileges = [{titre: "Canalisation du Cristal", description: "Ignorer une augmentation de Flétrine si elle dépasser le seuil de tolérance"}];
    faiblesses = [{description: "Attirance irrésistible vers les manifestations de magie corrompue ou artefacts anciens"}];
    specialisations = [{titre: "Canalisation cristalline", base: "magie", bonus: "artefacts cristallins, nécromancie"}];
}

class OriginelsCulture extends Culture{
    _id = "originels";
    name = "Originels";
    modificateurMagie = 1;
    privileges = [{titre: "Théorie Arcanique", description: "Poser une question au MJ sur un phénomène magique/historique → réponse fiable"}];
    faiblesses = [{description: "Difficulté à comprendre les motivations émotionnelles irrationnelles"}];
    specialisations = [{titre: "Théorie arcanique", base: "erudition", bonus: "comprendre et analyser la magie"}];
}

class SildariensCulture extends Culture{
    _id = "sildariens";
    name = "Sildariens";
    modificateurMagie = 1;
    privileges = [{titre: "Voie invisible", description: "Trouver un passage ou raccourci que personne ne connaît"}];
    faiblesses = [{description: "Mal à l'aise dans les environnements totalement contrôlés ou artificiels"}];
    specialisations = [{titre: "Harmonie élémentaire ", base: "volonte", bonus: "résistance aux perturbations mystiques"}];
}

class ArchipelCulture extends Culture{
    _id = "archipel";
    name = "Archipel";
    modificateurMagie = -2;
    privileges = [{titre: "Guidance des Statues", description: "Toucher un objet ancien → vision fragmentaire de son passé"}];
    faiblesses = [{description: "Confusion temporaire lors de l'exposition à des technologies avancées ou phénomènes magiques"}];
    specialisations = [{titre: "Traditions orales", base: "erudition", bonus: "mythes, rituels, statues"}];
}

class PortEsperanceCulture extends Culture{
    _id = "portesperance";
    name = "Port-Espérance";
    modificateurMagie = 0;
    privileges = [{titre: "Réseau Commercial", description: "Connaître quelqu'un qui peut aider dans la situation actuelle"}];
    faiblesses = [{description: "Vulnérabilité aux situations exigeant des sacrifices personnels sans bénéfice tangible"}];
    specialisations = [{titre: "Commerce et négociation ", base: "influence", bonus: "transactions commerciales"}];
}

//privilege {title: "", description: ""}
//copetence {nom: "", base: "", bonus: ""}

export class Cultures{
    static cultures = {
        nahar : NaharCulture,
        arckenea : ArckeneaCulture,
        breribForrose : BreribForroseCulture,
        breribValia : BreribValiaCulture,
        breribAlaoc : BreribAlaocCulture,
        breribRuanon : BreribRuanonCulture,
        azshar : AzsharCulture,
        originels : OriginelsCulture,
        sildariens : SildariensCulture,
        archipel  : ArchipelCulture,
        portesperance : PortEsperanceCulture,
    };

    static get(cultureId) {
        if(this.cultures[cultureId] !== undefined)
        {
            return new this.cultures[cultureId];
        }
        return null;
    }

    static list(){
        let ret = [];
        Object.values(this.cultures).forEach(element => {
            ret.push(new element);
        });

        return ret;
    }
}