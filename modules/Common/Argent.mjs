

export class Argent {
    static convertAtoB(argent) {
        argent = Number(argent);
        return {
            fragment: argent % 10,
            eclat: ((argent - (argent % 10)) / 10) %10,
            couronne: (argent - (argent % 100)) / 100
        };
    }

    static convertBtoA(obj) {
        console.log(obj)
        return Number(obj.fragment) + (10 * Number(obj.eclat)) + (100 * Number(obj.couronne));
    }
}
