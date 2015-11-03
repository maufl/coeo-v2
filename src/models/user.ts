import {fosp} from '../services/fosp';
import {cache} from '../services/cache';
import {Image} from './image';
import {Base} from './base';
import {Group} from './group';

export class User extends Base {
    motto: string;
    fullName: string;
    profilePicture: Image;
    coverPicture: Image;
    groups: Array = [];

    constructor(id: string) {
        super(id);
        this.profilePicture = Image.get(this.id + '/soc/photos/profile');
        this.coverPicture = Image.get(this.id + '/soc/photos/cover');
    }

    patch() {
        return fosp.patch(this.id + "/soc/me", { data: { fullName: this.fullName }}).then(() => {
            return fosp.patch(this.id + "/soc/me/motto", { data: this.motto });
        })
    }

    load() {
        if (this.$loading || this.$loaded) {
            return Promise.reject();
        }
        this.$loading = true;
        return fosp.get(this.id + "/soc/me").then((object) => {
            if (typeof object.data === 'object') {
                this.fullName = object.data.fullName;
            }
            this.$loading = false;
            this.$loaded = true;
            return fosp.get(this.id + "/soc/me/motto").then((object) => {
                this.motto = object.data;
            }).catch(() => {}).then(() => {
                return fosp.list(this.id + "/cfg/groups");
            }).then((list) => {
                this.groups = list.map( name => { return Group.get(this.id + "/cfg/groups/" + name); });
                return this;
            }).catch(() => {
                return this;
            });
        }).catch((error) => {
            this.$loading = false;
        });
    }
}
