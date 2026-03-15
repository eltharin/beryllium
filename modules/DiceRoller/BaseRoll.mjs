import * as system  from "../_helpers.mjs";

export class BaseRoll extends Roll {
    isCompetenceMagie()
    {
        console.error("can't have resolve isCompetenceMAgie on " + this.constructor.name);
    }

    getActor()
    {
        console.error("can't have resolve getToken on " + this.constructor.name);
    }

    static fromData(data) {
        return super.fromData(data);
    }

    async evaluate(options) {
        const ret = await super.evaluate(options);

        if(this instanceof BaseRoll && this.isCompetenceMagie()) {
            if(this.getActor().isSurchauffe) {
                const myRoll = new system.DiceRoller.SurchauffeRoll("1d12",{}, {});
                myRoll.toMessage({
                    async: true, 
                    flavor: "Surchauffe",
                    speaker: ChatMessage.getSpeaker({ alias: this.getActor().actor.name + " ( " + game.user.name + " )"}),
                });
            } else if (this.getActor().isDissonnance) {
                system.Actor.fct.enterSurchauffe(this.getActor().actor);
            }
        }



        return ret;
    }

    getTotalParts()
    {
        return [
            
        ]
    }

    convertTotal(tableau)
    {
        return tableau.map(e => {
            if(Array.isArray(e)) {
                return [e[0] || 0, e[1] || "+"];
            }
            else {
                return [e || 0, "+"];
            }
        })
    }

    getTotalText()
    {
        return this.getCalculText(this.convertTotal([...this.getTotalParts(), this.total]));
    }

    getTotalValue()
    {
        return this.getCalculValue(this.convertTotal([...this.getTotalParts(), this.total]));
    }

    getCalculText(tableau)
    {
        return tableau.reduce((str, val) => {
            return (str != "" ? str + " " + val[1] + " " : "") + String(val[0]) 
        },"");
    }

    getCalculValue(tableau)
    {
        return tableau.reduce((sum, val) => sum + (Number(val[0] || 0) * (val[1] == "-" ? -1 : 1)),0);
    }

    getResultat()
    {
        return this.getTotalValue() - this.getSeuil() >= 0;
    }

    getSeuil()
    {
        return 0;
    }
}
