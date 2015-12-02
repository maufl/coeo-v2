interface CacheMap {
  [key: string]: any
}

class Cache {
    map: CacheMap = {};

    get(model: Function, id: string): any {
        return this.map[`${model.name}:${id}`];
    }

    set(model: any): void {
        this.map[`${model.constructor.name}:${model.id}`] = model;
    }
}

export var cache = new Cache();
