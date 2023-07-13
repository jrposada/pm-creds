const action = () => {
    console.log('init');
};

const command = {
    name: 'init',
    description: 'Initialize config files',
    action,
};

export default command;
