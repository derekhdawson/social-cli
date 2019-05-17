const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');

module.exports = async (args) => {

    console.log(args);

    try {
        const user = await utils.getCurrentUser();
        if (user) {
            console.log('You are already sign in. You must be signed out to login.')
            return;
        }
    } catch (error) { console.log(error); }


    let email;
    let password;

    if (args.email && args.password) {
        email = args.email;
        password = args.password;
    } else {
        email = await utils.promptInput('What\'s your email? ');
        password = await utils.promptInput('What\'s your password? ');
    }

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