const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');

module.exports = async (args) => {
    const { id, username } = args;
    if (!id && !username) {
        console.log('you must either use --id or --username params');
        return;
    }

    const options = {};
    if (id) {
        options.id = id;
    } else {
        options.username = username;
    }

    const spinner = ora().start();
    api.acceptFriendRequest(options).then((response) => {
        spinner.stop().succeed(`${response.username} is now your friend 😎`);
    }).catch((error) => {
        spinner.stop().fail(error.response.data);
    });
}