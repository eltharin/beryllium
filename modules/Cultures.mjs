
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

class OriginelsCulture extends Culture{
    _id = "originels";
    name = "Originels";
    modificateurMagie = 1;
    privileges = ["privilege1", "privilege2"];
    faiblesses = ["faiblesse"];
    specialisations = ["specialisation"];
}

class SildariensCulture extends Culture{
    _id = "sildariens";
    name = "Sildariens";
    modificateurMagie = 1;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class ArckeneaCulture extends Culture{
    _id = "arckenea";
    name = "Arckénéa";
    modificateurMagie = 0;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class BreribCulture extends Culture{
    _id = "brerib";
    name = "Brérib";
    modificateurMagie = 0;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class PortEsperanceCulture extends Culture{
    _id = "portesperance";
    name = "Port-Espérance";
    modificateurMagie = 0;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class AzsharCulture extends Culture{
    _id = "azshar";
    name = "Azshar";
    modificateurMagie = 0;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class NaharCulture extends Culture{
    _id = "nahar";
    name = "Nahar";
    modificateurMagie = -1;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}
class ArchipelCulture extends Culture{
    _id = "archipel";
    name = "Archipel";
    modificateurMagie = -2;
    privileges = [];
    faiblesses = [];
    specialisations = [];
}

export class Cultures{
    static cultures = {
        originels : OriginelsCulture,
        sildariens : SildariensCulture,
        arckenea : ArckeneaCulture,
        brerib : BreribCulture,
        portesperance : PortEsperanceCulture,
        azshar : AzsharCulture,
        nahar : NaharCulture,
        archipel  : ArchipelCulture,
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