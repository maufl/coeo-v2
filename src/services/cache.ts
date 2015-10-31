class Cache {
    map = {};

    get(model: Function, id: string) {
        return this.map[`${model.name}:${id}`];
    }

    set(model: any) {
        this.map[`${model.constructor.name}:${model.id}`] = model;
    }
}

export var cache = new Cache();
