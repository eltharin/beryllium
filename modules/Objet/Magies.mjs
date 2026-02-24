
class Magie {
    oppose = null

    get id(){
        return this._id;
    }
     
    get name(){
        return this.name;
    }

    get oppose(){
        return this.oppose;
    }
}

class AirMagie extends Magie{
    _id = "air";
    name = "Air";
    oppose = "terre"
}

class TerreMagie extends Magie{
    _id = "terre";
    name = "Terre";
    oppose = "air"
}
class FeuMagie extends Magie{
    _id = "feu";
    name = "Feu";
    oppose = "eau"
}
class EauMagie extends Magie{
    _id = "eau";
    name = "Eau";
    oppose = "feu"
}
class VitaeMagie extends Magie{
    _id = "vitae";
    name = "Vitae";
    oppose = null
}

export class Magies{
    static magies = {
        air : AirMagie,
        terre : TerreMagie,
        feu : FeuMagie,
        eau : EauMagie,
        vitae : VitaeMagie,
    };

    static get(magieId) {
        console.log(magieId, this.magies[magieId])
        if(this.magies[magieId] !== undefined)
        {
            return new this.magies[magieId];
        }
        return null;
    }

    static list(){
        let ret = [];
        Object.values(this.magies).forEach(element => {
            ret.push(new element);
        });

        return ret;
    }
}