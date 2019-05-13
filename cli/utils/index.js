const readline = require('readline');
const config = require('../config');
const keytar = require('keytar');

exports.promptInput = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();
        });
    })
}

exports.isValidEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(String(email).toLowerCase());
    if (!valid) {
        return false;
    }
    return true;
}

exports.getCurrentUser = () => {
    return keytar.getPassword(config.keytar.service, config.keytar.account).then((user) => {
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }).catch(() => {
        return null;
    })
}