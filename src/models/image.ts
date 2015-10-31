import {fosp} from '../services/fosp';

export class Image {
    id: string;
    type: string;
    size: number;
    name: string;
    image: Image;

    constructor(id: string) {
        this.id = id;
        this.image = new window.Image();
    }

    static get(id: string) {
        var image = new Image(id);
        return image.load();
    }

    load() {
        return fosp.get(this.id).then(({ attachment = {}}) => {
            if (attachment.type !== "image/jpeg") {
                return Promise.reject('Resource ' + path + ' is not an image');
            }
            this.type = attachment.type;
            this.size = attachment.size;
            this.name = attachment.name;
            return fosp.read(this.id).then((body) => {
                var blob = new Blob([body], {type: this.type})
                this.image.src = URL.createObjectURL(blob)
                return this;
            });
        });
    }
}
