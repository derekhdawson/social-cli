const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const prettyjson = require('prettyjson');

let totalNumPostsFetched = 0;
const postLimit = 5;

const getPosts = async (skip, options) => {
    const spinner = ora().start();
    api.getPosts({skip, postLimit, ...options}).then((results) => {
        spinner.stop();
        const totalNumPosts = results.totalNumPosts;
        results.posts.forEach((result) => {
            const post = result.post;
            const _id = result._id;
            const username = result.user.username;
            delete result.post;
            delete result._id;
            delete result.user;
            result.createdAt = new Date(result.createdAt).toLocaleString();
            console.log(prettyjson.render({
                username,
                post,
                _id
            }));
            console.log(prettyjson.render(result));
            console.log('\n--------------------------------------------------\n');
        });

        totalNumPostsFetched += results.posts.length;

        if (totalNumPostsFetched < totalNumPosts) {
            utils.promptInput(`Do you want to fetch ${Math.min(postLimit, totalNumPosts - totalNumPostsFetched)} more posts (y/n)? `).then((answer) => {
                answer = answer.toLocaleLowerCase();
                if (answer === 'y' || answer === 'yes') {
                    getPosts(totalNumPostsFetched, options);
                }
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}

module.exports = async (args) => {

    const hashtags = args.hashtags && args.hashtags.split(',');
    const global = args.global;
    const taggedIn = args['tagged-in'];

    getPosts(0, { hashtags, global, taggedIn });
    
}