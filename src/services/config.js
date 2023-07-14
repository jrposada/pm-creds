import fs from 'fs';
import path from 'path';

export default class Config {
    static get dir() {
        const value = path.join(process.env.HOME, '.pm-creds');

        if (!fs.existsSync(value)) {
            throw new Error(`Could not found path "${value}".`);
        } else if (!fs.statSync(value).isDirectory()) {
            throw new Error(`Path "${filepath}" is not a directory.`);
        }

        return value;
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
