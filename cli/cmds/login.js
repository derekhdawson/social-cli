const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');

module.exports = async (args) => {

    const email = await utils.promptInput('What\'s your email? ');
    const password = await utils.promptInput('What\'s your password? ');

    if (!email) {
        console.log('no email was entered');
        return;
    }

    if (!password) {
        console.log('no password was entered');
        return;
    }

    const spinner = ora().start()
    try {
        const user = await api.login({
            email,
            password
        });
        spinner.stop().succeed('Sign in successful');
        await keytar.setPassword(config.keytar.service, config.keytar.account, JSON.stringify(user));
    } catch (error) {
        spinner.stop().fail(error.message);
    }
}