const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {

    api.getFriendRequests().then((response) => {
        console.log();
        response.forEach((friendRequest) => {
            console.log(prettyjson.render(friendRequest.from));
            if (response.length > 1) console.log('\n--------------------------------------------------');
            console.log();
        })
    }).catch((error) => {
        console.log(error);
    });
}