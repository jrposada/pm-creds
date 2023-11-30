import { daemonizeProcess } from 'daemonize-process';
import fs from 'fs';
import { env } from 'node:process';
import Api from '../services/api.js';
import AwsCreds from '../services/aws-creds.js';
import Config from '../services/config.js';

const action = (options) => {
    if (options.daemon) {
        if (fs.existsSync(Config.pidFile)) {
            console.error('Error:');
            console.error('  Looks like PID file already exist');
            console.error(
                '  Remember to run `pm-creds stop` to stop and cleanup daemon process',
            );
            return 1;
        }

        daemonizeProcess({
            env: Object.assign(env, {
                _OUTPUT_PID: '1',
            }),
        });
    }

    if (process.env._OUTPUT_PID) {
        fs.writeFileSync(Config.pidFile, `${process.pid}\n${process.env._}`);
    }

    const awsCreds = new AwsCreds('~/.aws/credentials');
    const api = new Api(9999, awsCreds);
    api.start();
};

const command = {
    name: 'main',
    description: '(Default) Runs sync process',
    action,
};

export default command;
