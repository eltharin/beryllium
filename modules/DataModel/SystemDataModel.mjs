

export class SystemDataModel extends foundry.abstract.TypeDataModel {

    static preSaveFunctions = [
    ];

    async _preUpdate(changes, options, user) {
        let clone = foundry.utils.duplicate(this); 
        foundry.utils.mergeObject(clone, changes.system, { insertKeys: true, insertValues: true }); 

        this.constructor.preSaveFunctions.forEach(element => {
            this[element](changes, clone);
        });
    }
}