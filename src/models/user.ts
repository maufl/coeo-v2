import {fosp} from '../services/fosp';
import {ImageAttachment} from './image-attachment';
import {Base} from './base';
import {Group} from './group';

export class User extends Base {
    motto: string;
    fullName: string;
    profilePicture: ImageAttachment;
    coverPicture: ImageAttachment;
    groups: Array<Group> = [];

    constructor(id: string) {
        super(id);
        this.profilePicture = ImageAttachment.get(this.id + '/soc/photos/profile');
        this.coverPicture = ImageAttachment.get(this.id + '/soc/photos/cover');
    }

    patch() {
        return fosp.patch(this.id + "/soc/me", { data: { fullName: this.fullName }}).then(() => {
            return fosp.patch(this.id + "/soc/me/motto", { data: this.motto });
        })
    }

    isCurrentUser() {
        if (fosp.currentUser && fosp.currentUser.id === this.id) {
            return true;
        }
        return false;
    }

    load(): Promise<any> {
        if (this.$loading || this.$loaded) {
            return Promise.reject(null);
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
                this.groups = list.map( (name: string) => { return Group.get(this.id + "/cfg/groups/" + name); });
                return this;
            }).catch(() => {
                return this;
            });
        }).catch((error) => {
            this.$loading = false;
        });
    }
}
