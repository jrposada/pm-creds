import fs from 'fs';
import selfsigned from 'selfsigned';
import Config from '../services/config.js';

const action = async () => {
    const certs = selfsigned.generate(null, { days: 365 });

    fs.writeFileSync(Config.crtFilepath, certs.cert);
    fs.writeFileSync(Config.pemFilepath, certs.cert);
    fs.writeFileSync(Config.privateKeyFilepath, certs.private);
};

const command = {
    name: 'certs',
    description: 'Creates self-signed SSL certificates',
    action,
};

export default command;
