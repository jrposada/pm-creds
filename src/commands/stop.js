import fs from 'fs';
import psList from 'ps-list';
import treeKill from 'tree-kill';
import Config from '../services/config.js';

const action = async (options) => {
    if (!fs.existsSync(Config.pidFile)) {
        console.log('No information about running process');
        return 0;
    }

    const [daemonPid, daemonExecPath] = fs
        .readFileSync(Config.pidFile)
        .toString()
        .split('\n');

    const processes = await psList();
    const cmd = processes.find((p) => p.pid === +daemonPid)?.cmd;

    if (cmd?.split(' ')[1] === daemonExecPath) {
        await new Promise((resolve) => {
            treeKill(daemonPid, 'SIGTERM', (err) => {
                if (err) {
                    console.error(
                        `Error killing process with PID ${daemonPid}: ${err.message}`,
                    );
                } else {
                    console.log(
                        `Process with PID ${daemonPid} terminated successfully.`,
                    );
                }

                resolve();
            });
        });
    } else {
        console.log('No matching process running');
    }

    fs.rmSync(Config.pidFile);

    console.log('Process has been stopped');
};

const command = {
    name: 'stop',
    description: 'Stop daemon process',
    action,
};

export default command;
