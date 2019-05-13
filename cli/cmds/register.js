const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');

const inputFailed = (message) => {
    ora().fail(message);
    return false;
}

const isValidUsername = (username) => {
    if (!username || username.length < 3) return inputFailed('username has to be longer than 2 characters');
    return true;
}

const isValidPassword = (password) => {
    if (!password || password.length < 3) return inputFailed('password has to be longer than 2 characters');
    return true;
}

const passwordsMatch = (p1, p2) => {
    if (p1 !== p2) return inputFailed('passwords do not match');
    return true;
}

const isValidEmail = (email) => {
    if (!utils.isValidEmail(email)) return inputFailed('invalid email');
    return true;
}

module.exports = async (args) => {
    
    let email;
    let password;
    let username;
    let retypedPassword;

    do {
        username = await utils.promptInput('What will be your username? ');
        email = await utils.promptInput('What\'s your email? ');
        password = await utils.promptInput('What\'s your password? ');
        retypedPassword = await utils.promptInput('Retype password ');
    } while (!isValidUsername(username) || !isValidEmail(email) || !isValidPassword(password) || !passwordsMatch(password, retypedPassword));

    const spinner = ora().start()
    try {
        const user = await api.registerUser({
            username,
            email,
            password
        });

        if (user) {
            await keytar.setPassword(config.keytar.service, config.keytar.account, JSON.stringify(user));
            spinner.stop().succeed('Welcome to the cli-social-network');
        } else {
            throw new Error('user could not be regsitered');
        }
    } catch (error) {
        spinner.stop().fail(error.response.data.message);
    }
}