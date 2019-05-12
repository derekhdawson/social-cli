const ora = require('ora');
const axios = require('axios');

module.exports = async (args) => {
    const spinner = ora().start()

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })

    spinner.stop();
    console.log('you are logged in');
}