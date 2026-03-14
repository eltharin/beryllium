import * as DiceRollerHelper from "./_helpers.mjs";
import {Surchauffe} from "../Helper/Surchauffe.mjs";

export class BaseRoll extends Roll {
    isCompetenceMagie()
    {
        console.error("can't have resolve isCompetenceMAgie on " + this.constructor.name);
    }

    getActor()
    {
        console.error("can't have resolve getToken on " + this.constructor.name);
    }

    async evaluate(options) {
        const ret = await super.evaluate(options);

        if(this instanceof BaseRoll && this.isCompetenceMagie()) {
            if(this.getActor().isSurchauffe) {
                const myRoll = new DiceRollerHelper.SurchauffeRoll("1d12",{}, {});
                myRoll.toMessage({async: true, flavor: "Surchauffe"});
            } else if (this.getActor().isDissonnance) {
                Surchauffe.enterSurchauffe(this.getActor().actor);
            }
        }



        return ret;
    }
}
