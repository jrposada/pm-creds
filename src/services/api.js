import cors from 'cors';
import express, { json } from 'express';
import fs from 'fs';
import https from 'https';
import AwsCreds from './aws-creds.js';
import Config from './config.js';

export default class Api {
    #instance;
    #port;
    #awsCreds;

    /**
     *
     * @param {number} port
     * @param {AwsCreds} awsCreds
     */
    constructor(port, awsCreds) {
        if (typeof port !== 'number') {
            throw new Error(`Port must be a number but it was ${typeof port}`);
        } else if (!(awsCreds instanceof AwsCreds)) {
            throw new Error('awsCreds must be an instance of AwsCreds');
        }

        this.#port = port;
        this.#awsCreds = awsCreds;

        this.#createInstance();
        this.#setupEndpoints();
    }

    /**
     * Starts api server.
     */
    start() {
        const options = {
            key: fs.readFileSync(Config.privateKeyFilepath),
            cert: fs.readFileSync(Config.crtFilepath),
        };
        https.createServer(options, this.#instance).listen(this.#port, () => {
            console.info(
                `pm-creds listening on port https://localhost:${this.#port}`,
            );
        });
    }

    #createInstance() {
        this.#instance = express();
        this.#instance.use(cors());
        this.#instance.use(json());
    }

    #setupEndpoints() {
        this.#instance.get('/aws', (request, response) => {
            console.info('GET /aws');

            const creds = this.#awsCreds.get();
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify(creds));
        });

        this.#instance.get('/aws/:profile', (request, response) => {
            console.info('GET /aws/:profile');

            const creds = this.#awsCreds.get(request.params.profile);

            if (creds) {
                response.setHeader('content-type', 'application/json');
                response.send(JSON.stringify(creds));
            } else {
                console.warn(`Unknown profile "${request.params.profile}"`);
                response
                    .status(400)
                    .send(`Unknown profile "${request.params.profile}"`);
            }
        });

        this.#instance.put('/aws', (request, response) => {
            console.info('PUT /aws');

            try {
                this.#awsCreds.update(request.body);
                response.send('Ok');
            } catch (e) {
                console.error('Could not save data', e);
                response.status(400).send('Error');
            }
        });

        // this.#instance.get('/test', (request, response) => {
        //     console.log('GET /test');

        //     console.log(request.body);

        //     response.send('Ok');
        // });
    }
}
