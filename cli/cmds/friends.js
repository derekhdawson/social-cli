const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {
    try {
        const friends = await api.getFriends();
        console.log(prettyjson.render(friends));
    } catch (error) {
        // console.log(error.response.data);
    }
    
}