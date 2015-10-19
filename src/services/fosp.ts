import {Connection} from 'node_modules/fosp.js/lib/connection';
import {SUCCEEDED} from 'node_modules/fosp.js/lib/response';
import {Request, AUTH, GET} from 'node_modules/fosp.js/lib/request';
import {URL} from 'node_modules/fosp.js/lib/url';

class FospService {
    constructor() {
        this.connection = null;
        this.open('localhost');
    }

    open(domain) {
        return Connection.open({scheme: 'ws', host: domain}).then((con) => {
            this.connection = con
            return Promise.resolve();
        });
    }

    authenticate(username, password) {
        if (this.connection === null) {
            return Promise.reject("Not connected");
        }
        var req = new Request({method: AUTH});
        var initialResponse = unescape(encodeURIComponent(`\0${username}\0${password}`));
        req.body = {
            sasl: {
                mechanism: "PLAIN",
                'initial-response': initialResponse
            }
        }
        return this.connection.sendRequest(req).then((resp)=> {
            if (resp.status === SUCCEEDED) {
                return Promise.resolve();
            }
            return Promise.reject('Authentication failed, code: ' + resp.code);
        });
    }

    getUser(username) {
        if (this.connection === null) {
            return Promise.reject("Not connected");
        }
        var url = new URL(username + "/soc/me");
        var req = new Request({method: GET, url: url});
        return this.connection.sendRequest(req).then((resp) => {
            if (resp.status === SUCCEEDED) {
                return Promise.resolve(resp.body.data);
            }
            return Promise.reject('Response code was ' + resp.code);
        })
    }
}

export var fosp = new FospService();
