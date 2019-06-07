const ora = require('ora')
const api = require('../api');
const utils = require('../utils');
const prettyjson = require('prettyjson');
const { forEach } = require('p-iteration');
const terminalLink = require('terminal-link');
const terminalImage = require('terminal-image');
const got = require('got');

let totalNumPostsFetched = 0;
const postLimit = 5;

const getPosts = async (skip, options) => {
    const spinner = ora().start();

    try {
        const results = await api.getPosts({skip, postLimit, ...options});

        const imagesMap = {};
        let index = 0;
        await forEach(results.posts, async (result) => {
            const { imageURL } = result;
            if (imageURL) {
                const { body } = await got(imageURL, {encoding: null});
                const imageToPrint = await terminalImage.buffer(body);
                imagesMap[index] = imageToPrint;
                index++;
            }
        })
        
        spinner.stop();
        const totalNumPosts = results.totalNumPosts;
        results.posts.forEach((result, i) => {
            const post = result.post;
            const _id = result._id;
            const username = result.user.username;
            const imageURL = result.imageURL;
            delete result.post;
            delete result._id;
            delete result.user;
            delete result.imageURL;
            result.createdAt = new Date(result.createdAt).toLocaleString();
            console.log(prettyjson.render({
                username,
                post,
                _id
            }));
            console.log(prettyjson.render(result));
            if (imagesMap[i]) {
                console.log(terminalLink(imageURL, imageURL));
                console.log(imagesMap[i]);
            }
            console.log('\n--------------------------------------------------\n');
        })

        totalNumPostsFetched += results.posts.length;

        if (totalNumPostsFetched < totalNumPosts) {
            utils.promptInput(`Do you want to fetch ${Math.min(postLimit, totalNumPosts - totalNumPostsFetched)} more posts (y/n)? `).then((answer) => {
                answer = answer.toLocaleLowerCase();
                if (answer === 'y' || answer === 'yes') {
                    getPosts(totalNumPostsFetched, options);
                }
            })
        }
    } catch (error) {
        spinner.stop();
        console.log(error);
    }
}

// const getPosts = async (skip, options) => {
//     const spinner = ora().start();
//     api.getPosts({skip, postLimit, ...options}).then((results) => {
//         spinner.stop();
//         const totalNumPosts = results.totalNumPosts;
//         // results.posts.forEach((result) => {
//         for (let i = 0; i < results.posts.length; i++) {
//             const result = results.posts[i];
//             const post = result.post;
//             const _id = result._id;
//             const username = result.user.username;
//             const imageURL = result.imageURL;
//             delete result.post;
//             delete result._id;
//             delete result.user;
//             // delete result.imageURL;
//             result.createdAt = new Date(result.createdAt).toLocaleString();
//             console.log(prettyjson.render({
//                 username,
//                 post,
//                 _id
//             }));
//             console.log(prettyjson.render(result));
//             if (imageURL) {
                // const terminalImage = require('terminal-image');
                // const got = require('got');

                // const { body } = await got(imageURL, {encoding: null});
                // console.log(await terminalImage.buffer(body));
//             }
//             console.log('\n--------------------------------------------------\n');
//         }
//         // });

//         totalNumPostsFetched += results.posts.length;

//         if (totalNumPostsFetched < totalNumPosts) {
//             utils.promptInput(`Do you want to fetch ${Math.min(postLimit, totalNumPosts - totalNumPostsFetched)} more posts (y/n)? `).then((answer) => {
//                 answer = answer.toLocaleLowerCase();
//                 if (answer === 'y' || answer === 'yes') {
//                     getPosts(totalNumPostsFetched, options);
//                 }
//             })
//         }
//     }).catch((error) => {
//         console.log(error);
//     })
// }

module.exports = async (args) => {

    const hashtags = args.hashtags && args.hashtags.split(',');
    const global = args.global;
    const taggedIn = args['tagged-in'];

    getPosts(0, { hashtags, global, taggedIn });
    
}