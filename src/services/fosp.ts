import {Connection} from 'fosp.js/lib/connection';
import {SUCCEEDED, FAILED} from 'fosp.js/lib/response';
import {Request, AUTH, GET, READ, LIST} from 'fosp.js/lib/request';
import {URL as FOSPURL} from 'fosp.js/lib/url';
import {EventEmitter} from 'fosp.js/lib/events';
import {User} from '../models/user';

class FospService extends EventEmitter {
    currentUser: User;
    connection: Connection = null;
    connecting: bool = false;

    open(domain) {
        this.connecting = true;
        return Connection.open({scheme: 'ws', host: domain}).then((con) => {
            this.connection = con
            this.connecting = false;
            this.emit('connected');
            return Promise.resolve();
        });
    }

    awaitConnection() {
        if (!this.connecting) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
                reject("Timeout while waiting for the connection.");
            }, 1500);
            this.on('connected', () => {
                clearTimeout(timeout);
                resolve();
            })
        })
    }

    authenticate(username, password) {
        var initialResponse = unescape(encodeURIComponent(`\0${username}\0${password}`));
        var body = {
            sasl: {
                mechanism: "PLAIN",
                'initial-response': initialResponse
            }
        }
        return this.sendRequest({method: AUTH, body: body}).then(() => {
            User.get(username).then((user) => {
                this.currentUser = user;
                this.emit('userChanged');
            })
            this.emit('authenticated');
            return true
        });
    }

    get(path: string) {
        var url = new FOSPURL(path);
        return this.sendRequest({method: GET, url: url});
    }

    list(url: string) {
        var url = new FOSPURL(url);
        return this.sendRequest({method: LIST, url: url});
    }

    read(url: string) {
        var url = new FOSPURL(url);
        return this.sendRequest({method: READ, url: url});
    }

    sendRequest(options: Object) {
        if (this.connection === null && !this.connecting) {
            return Promise.reject("Not connected");
        }
        var req = new Request(options);
        return this.awaitConnection().then(() => {
            return this.connection.sendRequest(req);
        }).then((response) => {
            if (response.status === FAILED) {
                return Promise.reject("Could not " + options.method + " " + options.url + ", code " + response.code);
            }
            return response.body;
        })
    }
}

export var fosp = new FospService();

fosp.open('localhost').then(() => {
    fosp.authenticate('alice@localhost.localdomain', 'test1234');
});
