import {Connection} from '../fosp/connection';
import {SUCCEEDED, FAILED} from '../fosp/response';
import {Request, RequestOptions, AUTH, GET, READ, LIST, CREATE, WRITE, PATCH} from '../fosp/request';
import {Response} from '../fosp/response';
import {URL as FOSPURL} from '../fosp/url';
import {EventEmitter} from '../fosp/events';
import {User} from '../models/user';

class FospService extends EventEmitter {
    currentUser: User;
    connection: Connection = null;
    connecting: boolean = false;

    open(domain: string) {
        this.connecting = true;
        return Connection.open({scheme: 'ws', host: domain}).then((con: Connection) => {
            this.connection = con
            this.connecting = false;
            this.emit('connected');
            return Promise.resolve();
        });
    }

    awaitConnection(): Promise<string> {
        if (!this.connecting) {
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
                reject("Timeout while waiting for the connection.");
            }, 1500);
            this.on('connected', () => {
                clearTimeout(timeout);
                resolve(null);
            })
        })
    }

    authenticate(username: string, password: string) {
        var initialResponse = `\0${username}\0${password}`;
        var body = {
            sasl: {
                mechanism: "PLAIN",
                'initial-response': initialResponse
            }
        }
        return this.sendRequest({method: AUTH, body: body}).then(() => {
            this.currentUser = User.get(username);
            this.emit('authenticated');
            return true
        });
    }

    get(path: string) {
      return this.sendRequest({
        method: GET,
        url: new FOSPURL(path)
      });
    }

    patch(url: string, body: any) {
      return this.sendRequest({
        method: PATCH,
        url: new FOSPURL(url),
        body: body
      });
    }

    list(url: string) {
      return this.sendRequest({
        method: LIST,
        url: new FOSPURL(url)
      });
    }

    read(url: string) {
      return this.sendRequest({
        method: READ,
        url: new FOSPURL(url)
      });
    }

    write(url: string, body: any) {
      return this.sendRequest({
        method: WRITE,
        url: new FOSPURL(url),
        body: body
      });
    }

    create(url: string, body: any) {
      return this.sendRequest({
        method: CREATE,
        url: new FOSPURL(url),
        body: body
      });
    }

    sendRequest(options: RequestOptions): Promise<any> {
        if (this.connection === null && !this.connecting) {
            return Promise.reject("Not connected");
        }
        var req = new Request(options);
        return this.awaitConnection().then(() => {
            return this.connection.sendRequest(req);
        }).then((response: Response) => {
            if (response.status === FAILED) {
                return Promise.reject("Could not " + options.method + " " + options.url + ", code " + response.code);
            }
            return response.body;
        })
    }

    ensureExistence(id: string): Promise<any> {
        if (id.indexOf('/') === id.length - 1) {
            return Promise.resolve(true);
        }
        var parent = id.split('/').slice(0, -1).join('/');
        return this.ensureExistence(parent).then(() => {
            return this.get(id).catch(() => {
                return this.create(id, {});
            })
        })
    }
}

export var fosp = new FospService();
