import { program } from 'commander';
import certs from './certs.js';
import init from './init.js';
import main from './main.js';
import stop from './stop.js';

program
    .command(main.name, { isDefault: true })
    .description(main.description)
    .option('-d, --daemon', 'Run as a daemon')
    .action(main.action);
program.command(stop.name).description(stop.description).action(stop.action);
program.command(init.name).description(init.description).action(init.action);
program.command(certs.name).description(certs.description).action(certs.action);

program.parse();
