

export class DeBeryllium extends foundry.dice.terms.Die {
    static DENOMINATION = "b";

    constructor(termData) {
        termData.faces = 12;
        super(termData);
    }

    async roll({ minimize=false, maximize=false, ...options}={}) {

        const roll = {result: undefined, active: true, r: undefined};

        roll.result = await this._roll(options);
        if ( roll.result === undefined ) {
            const rand = this.randomFace();
            roll.result = rand;
        }

        if ( roll.result <= 3 ) roll.failure = true;
        if ( roll.result >= 10 ) roll.success = true;

        this.results.push(roll);

        return roll;
    }

    get total() {
        return this.results.reduce((total, r) => total + (r.success ? 1 : 0) - (r.failure ? 1 : 0), 0);
    }

    getResultLabel(diceTerm) {

        switch(diceTerm.result) {
            case 1: return "-";
            case 2: return "-";
            case 3: return "-";

            case 10: return "+";
            case 11: return "+";
            case 12: return "+";
        }
        return " ";
    }
}
