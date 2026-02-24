

export class DeInterference extends foundry.dice.terms.Die {
    static DENOMINATION = "i";
    resultat = "";

    constructor(termData) {
        if(termData.number > 1)
        {
            termData.number = 1;
            ui.notifications.error(`Vous ne pouvez lancer qu'un seul dé d'interférence.`);
        }
        termData.faces = 12;
        super(termData);
    }

    async roll({ minimize=false, maximize=false, ...options}={}) {

        const roll = {result: undefined, active: true};

        roll.result = await this._roll(options);
        if ( roll.result === undefined ) {
            const rand = this.randomFace();
            roll.result = rand;
        }

        if ( roll.result <= 3 ) this.resultat = "Standard";
        else if ( roll.result <= 6 ) this.resultat = "Elevé";
        else if ( roll.result <= 9 ) this.resultat = "Extreme";

        this.results.push(roll);

        return roll;
    }

    get total() {
        if(this.results[0].result <= 3)
        {
            return 1;
        }
        else if(this.results[0].result <= 6)
        {
            return 2;
        }
        else if(this.results[0].result <= 9)
        {
            return 3;
        }

        return 0;
    }

    getResultLabel(diceTerm) {

        let val = " ";
        if(diceTerm.result <= 3)
        {
            val = "systems/beryllium/assets/pics/face1.webp";
        }
        else if(diceTerm.result <= 6)
        {
            val = "systems/beryllium/assets/pics/face2.webp";
        }
        else if(diceTerm.result <= 9)
        {
            val = "systems/beryllium/assets/pics/face3.webp";
        }
        return val;
    }
}
