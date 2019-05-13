const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');

module.exports = async (args) => {
    try {
        await keytar.deletePassword(config.keytar.service, config.keytar.account);
        ora().succeed('sign out successful');
    } catch (error) {
        ora().fail(error.message);
    }
}