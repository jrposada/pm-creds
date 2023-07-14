import { program } from 'commander';
import certs from './certs.js';
import init from './init.js';
import main from './main.js';

program
    .command(main.name, { isDefault: true })
    .description(main.description)
    .action(main.action);
program.command(init.name).description(init.description).action(init.action);
program.command(certs.name).description(certs.description).action(certs.action);

program.parse();
