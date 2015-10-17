import {Connection} from 'node_modules/fosp.js/lib/connection';
import {SUCCEEDED} from 'node_modules/fosp.js/lib/response';
import {Request, AUTH} from 'node_modules/fosp.js/lib/request';

class FospService {
    constructor() {
        this.connection = null;
    }

    open(domain) {
        return Connection.open({scheme: 'ws', host: domain}).then((con) => {
            this.connection = con
            return Promise.resolve();
        });
    }

    authenticate(username, password) {
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
            return Promise.reject('Authentication failed, code: ', resp.code);
        });
    }
}

export var fosp = new FospService();
