import {fosp} from '../services/fosp';
import {Base} from './base';
import {FospObject} from '../fosp/object';

export class ImageAttachment extends Base {
  type: string;
  size: number;
  name: string;
  image: Image;

  constructor(id: string) {
    super(id);
    this.image = new Image();
  }

  write(file: File): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      var reader = new FileReader();
      reader.onload = () => {
        resolve(this.ensureExistence().then(() => {
          return fosp.write(this.id, reader.result).then(() => {
            return fosp.patch(this.id, { attachment: { name: file.name, size: file.size, type: file.type }}).then(() => {
              this.$loaded = false;
              this.load();
              return true;
            })
          })
        }))
      };
      reader.onerror = (error) => { reject(error) };
      reader.readAsArrayBuffer(file);
    });
  }

  load() {
    return super.load().then((object) => {
      var { attachment =  { size: 0 } } = object;
      if (typeof attachment.type !== 'string' || !attachment.type.match(/image\//)) {
        return new Promise<FospObject>((resolve, reject) => { reject('Resource ' + this.id + ' is not an image') });
      }
      this.type = attachment.type;
      this.size = attachment.size;
      this.name = attachment.name;
      return fosp.read(this.id).then((body: ArrayBuffer) => {
        var blob = new Blob([body], {type: this.type});
        this.image.src = URL.createObjectURL(blob);
        return Promise.resolve(object);
      });
    });
  }
}
