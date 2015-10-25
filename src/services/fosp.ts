import {Connection} from 'fosp.js/lib/connection';
import {SUCCEEDED, FAILED} from 'fosp.js/lib/response';
import {Request, AUTH, GET, READ, LIST} from 'fosp.js/lib/request';
import {URL as FOSPURL} from 'fosp.js/lib/url';
import {EventEmitter} from 'fosp.js/lib/events';

class FospService extends EventEmitter {
    currentUser: string;

    constructor() {
        this.connection = null;
        this.open('localhost');
    }

    open(domain) {
        return Connection.open({scheme: 'ws', host: domain}).then((con) => {
            this.connection = con
            this.emit('connected');
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
                this.currentUser = username;
                this.emit('authenticated');
                return Promise.resolve();
            }
            return Promise.reject('Authentication failed, code: ' + resp.code);
        });
    }

    getUser(username) {
        if (this.connection === null) {
            return Promise.reject("Not connected");
        }
        var url = new FOSPURL(username + "/soc/me");
        var req = new Request({method: GET, url: url});
        return this.connection.sendRequest(req).then((resp) => {
            if (resp.status === SUCCEEDED) {
                return Promise.resolve(resp.body.data);
            }
            return Promise.reject('Response code was ' + resp.code);
        })
    }

    loadImage(path) {
        if (this.connection === null) {
            return Promise.reject("Not connected");
        }
        var url = new FOSPURL(path);
        var req = new Request({method: GET, url: url});
        return this.connection.sendRequest(req).then((response) => {
            if (response.status === FAILED) {
                return Promise.reject("Could not load image: " + response.code);
            }
            var attachment = response.body.attachment || { type: ''};
            if (!attachment.type.match(/^image\//)) {
                return Promise.reject('Resource ' + path + ' is not an image');
            }
            var req = new Request({method: READ, url: url});
            return this.connection.sendRequest(req).then((response) => {
                var blob = new Blob([response.body], {type: attachment.type})
                var img = new Image()
                img.src = URL.createObjectURL(blob)
                return Promise.resolve(img);
            });
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

    sendRequest(options: Object) {
        if (this.connection === null) {
            return Promise.reject("Not connected");
        }
        var req = new Request(options);
        return this.connection.sendRequest(req).then((response) => {
            if (response.status === FAILED) {
                return Promise.reject("Could not " + options.method + " " + options.url + ", code " + response.code);
            }
            return response.body;
        })
    }
}

export var fosp = new FospService();
