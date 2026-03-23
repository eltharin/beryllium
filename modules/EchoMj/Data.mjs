


export class Data {
    static get(scene) {
        return scene.getFlag("beryllium", "echoMj");
    }

    static set(scene, data) {
        return scene.setFlag("beryllium", "echoMj", data);
    }
}