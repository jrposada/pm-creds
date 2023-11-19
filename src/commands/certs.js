import { execSync } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Config from '../services/config.js';

const action = () => {
    try {
        const caConfigFilePath = resolve(
            dirname(fileURLToPath(import.meta.url)),
            '../openssl-ca.cnf',
        );

        const serverConfigFilePath = resolve(
            dirname(fileURLToPath(import.meta.url)),
            '../openssl-server.cnf',
        );

        // Generate CA Certificates
        execSync(
            `openssl req \
                -x509 \
                -newkey rsa:2048 \
                -keyout ${Config.caKey} \
                -out ${Config.caCert} \
                -days 365 \
                -config ${caConfigFilePath} \
                -sha256 \
                -new \
                -nodes`,
        );

        // Generate Server certificate key and certificate signing request
        execSync(
            `openssl req \
                -newkey rsa:2048 \
                -keyout ${Config.serverKey} \
                -out ${Config.serverCsr} \
                -config ${serverConfigFilePath} \
                -sha256 \
                -new \
                -nodes`,
        );

        // Sign the Server CSR with the CA
        execSync(
            `openssl x509 \
                -req \
                -in ${Config.serverCsr} \
                -CA ${Config.caCert} \
                -CAkey ${Config.caKey} \
                -CAcreateserial \
                -out ${Config.serverCert} \
                -days 365 \
                -extensions v3_req \
                -extfile ${serverConfigFilePath} \
                -sha256`,
        );

        console.log('Certificates generated successfully.');
    } catch (error) {
        console.error('Error generating certificates:', error.message);
    }
};

const command = {
    name: 'certs',
    description: 'Creates self-signed SSL certificates',
    action,
};

export default command;
