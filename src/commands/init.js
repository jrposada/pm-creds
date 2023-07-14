const action = () => {
    console.log('TODO');
    console.log(
        'Remember to run `pm-creds certs` at least once before running the main command',
    );
};

const command = {
    name: 'init',
    description: 'Initialize config files',
    action,
};

export default command;
