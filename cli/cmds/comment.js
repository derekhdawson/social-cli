const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {

    if (!args.comment || !args.postId) {
        console.log(`you must include the arguments --comment and --postId`);
        return;
    }

    const { comment, postId } = args;

    const spinner = ora().start();

    try {
        await api.commentOnPost({ postId, comment });
        spinner.stop().succeed('your comment was created');
    } catch (error) {
        spinner.stop().fail(error.response.data.message);
    }
    
}