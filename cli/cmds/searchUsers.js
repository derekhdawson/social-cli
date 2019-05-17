const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {
    try {
        const users = await api.searchUsers();
        console.log(prettyjson.render(users));
    } catch (error) {
        console.log(error);
    }
}