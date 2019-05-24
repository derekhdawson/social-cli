const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const keytar = require('keytar');
const config = require('../config');
const prettyjson = require('prettyjson');

module.exports = async (args) => {
    let post;
    let taggedUsers;
    let hashtags;
    if (args.post) {
        post = args.post;
        taggedUsers = args.tag ? args.tag.split(',') : null;
        hashtags = args.hashtags ? args.hashtags.split(',') : null;
    } else {
        try {
            post = await utils.promptInput('post: ');
            taggedUsers = await utils.promptInput('tag users: ');
            hashtags = await utils.promptInput('hashtags: ');
            taggedUsers = taggedUsers ? taggedUsers.split(',') : null;
            hashtags = hashtags ? hashtags.split(',') : null;
        } catch (error) {
            console.log(error);
        }
    }

    if (!post) {
        console.log(`you must include the argument 'post'`);
        return;
    }

    const spinner = ora().start();

    try {
        await api.createPost({ post, taggedUsers, hashtags });
        spinner.stop().succeed('your post was created');
    } catch (error) {
        spinner.stop().fail(error.response.data.message);
    }
    
}