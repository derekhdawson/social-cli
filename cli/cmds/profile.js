const ora = require('ora')
const api = require('../api');
const utils = require('../utils');

module.exports = async (args) => {
    try {
        const user = await api.getProfile();
        console.log(user);
    } catch (error) { console.log(error); }
}