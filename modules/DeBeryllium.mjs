

export class DeBeryllium extends foundry.dice.terms.Die {
    static DENOMINATION = "b";

    static MODIFIERS = {
        d: "dissonance",
    }
    constructor(termData) {
        termData.faces = 12;
        super(termData);
    }

    async roll({ minimize=false, maximize=false, ...options}={}) {

        const roll = {result: undefined, active: true, dissonance: false};

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

        let val = " ";
        if(diceTerm.result <= 3)
        {
            val = "-";
        }
        else if(diceTerm.result >= 10)
        {
            val = "+";
        }
        console.log(diceTerm)
        if(diceTerm.dissonance)
        {
            val += "d"
        }
        return val;
    }

    async dissonance(modifier) {
        console.log("dissonance", modifier, this.results)
        this.results.forEach(element => {
            element.dissonance = true;
        });
    }
}
