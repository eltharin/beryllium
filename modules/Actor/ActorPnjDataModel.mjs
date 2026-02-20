import {BaseActorDataModel} from './BaseActorDataModel.mjs';


export class ActorPnjDataModel extends BaseActorDataModel {
    static defineSchema() {
    // All Actors have resources.
        return {
            ...super.defineSchema(),
        };
    }

}