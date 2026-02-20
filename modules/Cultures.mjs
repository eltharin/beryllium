
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
}

class SildariensCulture extends Culture{
    _id = "sildariens";
    name = "Sildariens";
    modificateurMagie = 1;
}
class ArckeneaCulture extends Culture{
    _id = "arckenea";
    name = "Arckénéa";
    modificateurMagie = 0;
}
class BreribCulture extends Culture{
    _id = "brerib";
    name = "Brérib";
    modificateurMagie = 0;
}
class PortEsperanceCulture extends Culture{
    _id = "portesperance";
    name = "Port-Espérance";
    modificateurMagie = 0;
}
class AzsharCulture extends Culture{
    _id = "azshar";
    name = "Azshar";
    modificateurMagie = 0;
}
class NaharCulture extends Culture{
    _id = "nahar";
    name = "Nahar";
    modificateurMagie = -1;
}
class ArchipelCulture extends Culture{
    _id = "archipel";
    name = "Archipel";
    modificateurMagie = -2;
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

    }

    static list(){
        let ret = [];
        Object.values(this.cultures).forEach(element => {
            ret.push(new element);
        });

        return ret;
    }
}