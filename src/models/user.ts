import {fosp} from '../services/fosp';
import {cache} from '../services/cache';
import {Image} from './image';
import {Base} from './base';

export class User extends Base {
    motto: string;
    fullName: string;
    profilePicture: Image;
    coverPicture: Image;

    constructor(id: string) {
        super(id);
        this.profilePicture = Image.get(this.id + '/soc/photos/profile');
        this.coverPicture = Image.get(this.id + '/soc/photos/cover');
    }

    load() {
        if (this.$isLoading || this.$isLoaded) {
            return Promise.reject();
        }
        this.$isLoading = true;
        return fosp.get(this.id + "/soc/me").then((object) => {
            this.fullName = object.data.fullName;
            fosp.get(this.id + "/soc/me/motto").then((object) => {
                this.$isLoading = false;
                this.$isLoaded = true;
                this.motto = object.data;
            });
            return this;
        });
    }
}
