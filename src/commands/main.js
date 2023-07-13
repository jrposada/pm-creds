import Api from '../services/api.js';
import AwsCreds from '../services/aws-creds.js';

const action = () => {
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
