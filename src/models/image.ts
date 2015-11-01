import {fosp} from '../services/fosp';
import {Base} from './base';

export class Image extends Base {
    type: string;
    size: number;
    name: string;
    image: Image;

    constructor(id: string) {
        super(id);
        this.image = new window.Image();
    }

    load() {
        return super.load().then(({ attachment = {}}) => {
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
