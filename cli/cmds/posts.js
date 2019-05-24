const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {

    // if (!args.comment || !args.postId) {
    //     console.log(`you must include the arguments --comment and --postId`);
    //     return;
    // }

    api.getPosts().then((results) => {
        console.log();
        results.forEach((result) => {
            const post = result.post;
            const comments = results.comments;
            delete result.post;
            result.createdAt = new Date(result.createdAt).toLocaleString();
            console.log(prettyjson.render({
                post
            }));
            console.log(prettyjson.render(result));
            console.log('\n--------------------------------------------------\n');
        })
    }).catch((error) => {
        console.log(error);
    })
    
}