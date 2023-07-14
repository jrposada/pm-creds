import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

export default class AwsCreds {
    #creds;

    /**
     *
     * @param {string} filepath Path to aws credentials file. Usually `~/.aws/credentials`
     */
    constructor(filepath) {
        const resolvedPath =
            filepath[0] === '~'
                ? path.join(process.env.HOME, filepath.slice(1))
                : filepath;

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Could not found path "${filepath}".`);
        } else if (fs.statSync(resolvedPath).isDirectory()) {
            throw new Error(
                `Path "${filepath}" is a directory. It must be a file.`,
            );
        }

        this.#parseFile(resolvedPath);

        console.log(`Watching file "${resolvedPath}"`);
        chokidar
            .watch(resolvedPath, { usePolling: true })
            .on('change', (path) => {
                this.#parseFile(path);
            });
    }

    update(partialCreds) {
        Object.keys(partialCreds).forEach((profile) => {
            if (!partialCreds[profile] || partialCreds[profile] === {}) {
                return;
            }

            Object.entries(partialCreds[profile]).forEach(([key, value]) => {
                this.#setValue(profile, key, value);
            });
        });
    }

    get(profile) {
        if (!profile) {
            return structuredClone(this.#creds);
        }

        return this.#creds[profile];
    }

    #parseFile(filepath) {
        this.#creds = {};
        let profile;
        const data = fs
            .readFileSync(filepath, {
                encoding: 'utf-8',
                flag: 'r',
            })
            .split(/\r?\n/);
        data.forEach((line) => {
            if (
                line.length > 2 &&
                line[0] === '[' &&
                line[line.length - 1] === ']'
            ) {
                profile = line.slice(1, -1);
            } else if (!!profile && line[0] !== '=' && line.includes('=')) {
                let lineData = line.split('=');
                this.#setValue(profile, lineData[0], lineData[1]);
            }
        });
    }

    #setValue(profile, key, value) {
        if (!this.#creds[profile]) {
            this.#creds[profile] = {};
        }

        this.#creds[profile][key] =
            key === 'aws_session_token' ? value.replaceAll('"', '') : value;
    }
}
