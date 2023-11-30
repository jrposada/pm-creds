import fs from 'fs';
import path from 'path';

export default class Config {
    static get _dir() {
        return path.join(process.env.HOME, '.pm-creds');
    }

    static get dir() {
        if (!fs.existsSync(this._dir)) {
            throw new Error(`Could not found path "${this._dir}".`);
        } else if (!fs.statSync(this._dir).isDirectory()) {
            throw new Error(`Path "${filepath}" is not a directory.`);
        }

        return this._dir;
    }

    static get caKey() {
        return path.join(Config.dir, 'ca.key');
    }

    static get caCert() {
        return path.join(Config.dir, 'ca.crt');
    }

    static get serverKey() {
        return path.join(Config.dir, 'server.key');
    }

    // Certificate Signing Request
    static get serverCsr() {
        return path.join(Config.dir, 'server.csr');
    }

    static get serverCert() {
        return path.join(Config.dir, 'server.crt');
    }

    static get pidFile() {
        return path.join(Config.dir, 'daemon.pid');
    }

    static get logFile() {
        return path.join(Config.dir, 'log.log');
    }
}
