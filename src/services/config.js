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

    static get pemFilepath() {
        return path.join(Config.dir, 'ca-cert.pem');
    }

    static get crtFilepath() {
        return path.join(Config.dir, 'cert.crt');
    }

    static get privateKeyFilepath() {
        return path.join(Config.dir, 'key');
    }
}
