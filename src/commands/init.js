import fs from 'fs';
import certs from '../commands/certs.js';
import Config from '../services/config.js';

const action = () => {
    if (!fs.existsSync(Config._dir)) {
        fs.mkdirSync(Config._dir);
    } else if (!fs.statSync(Config._dir).isDirectory()) {
        throw new Error(
            `Path "${Config._dir}" already exist but is not a directory.`,
        );
    }

    console.info('\nGenerating certs...\n');
    certs.action();
    console.info(
        '    Note that validation period is 365 days. To re-generate on demand run `pm-creds certs`',
    );

    console.info('\npm-creds has been initialized successfully.\n');
    console.info('    Run `pm-creds` to start.');
};

const command = {
    name: 'init',
    description: 'Initialize config files',
    action,
};

export default command;
