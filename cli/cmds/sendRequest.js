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
    api.sendFriendRequest(options).then((response) => {
        console.log(response);
        spinner.stop().succeed('friend request was sent ✈️');
    }).catch((error) => {
        spinner.stop().fail(error.response.data);
    });
}