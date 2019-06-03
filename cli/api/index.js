const config = require('../config');
const axios = require('axios');
const utils = require('../utils');
const ora = require('ora')

const SERVER_URL = config.environment === config.environments.DEV ? 'http://localhost:8000/api' : 'https://cli-social-network.herokuapp.com/api';

const request = (options) => {
    return new Promise((resolve, reject) => {
        let requestObj = {
            method: options.method,
            url: `${SERVER_URL}/${options.endpoint}`,
        }

        if (options.body) {
            requestObj.data = options.body;
        }

        if (options.params) {
            requestObj.params = options.params;
        }
    
        if (options.authNotRequired) {
            axios.request(requestObj).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        } else {
            utils.getCurrentUser().then((user) => {
                if (!user) {
                    reject('ERROR: you must sign in first');
                } else {
                    const { token } = user;
                    requestObj.headers = {
                        Authorization: `Token ${token}`
                    };
                    axios.request(requestObj).then((response) => {
                        resolve(response.data);
                    }).catch((error) => {
                        reject(error);
                    })
                }
            })
        }
    })
}

exports.register = (user) => {
    return request({
        method: 'POST',
        endpoint: 'users',
        authNotRequired: true,
        body: { user }
    }).then((response) => {
        if (response.user) {
            return response.user;
        }
        throw new Error('ERROR: user could not be registered');
    }).catch((error) => {
        throw error;
    });
}

exports.login = (user) => {
    return request({
        method: 'POST',
        endpoint: 'users/login',
        authNotRequired: true,
        body: { user }
    }).then((response) => {
        if (response.user) {
            return response.user;
        }
        throw new Error('ERROR: user could not be registered');
    }).catch((error) => {
        throw error;
    });
}

exports.getProfile = () => {
    return request({
        method: 'GET',
        endpoint: 'users/profile'
    }).then((response) => {
        return response.user;
    }).catch((error) => {
        throw error;
    })
};

exports.sendFriendRequest = ({ id, username }) => {
    const body = {};
    if (id) body.id = id;
    if (username) body.username = username;
    return request({
        method: 'POST',
        endpoint: 'users/sendFriendRequest',
        body
    })
};

exports.acceptFriendRequest = ({ id, username }) => {
    const body = {};
    if (id) body.id = id;
    if (username) body.username = username;
    return request({
        method: 'POST',
        endpoint: 'users/acceptFriendRequest',
        body
    })
};

exports.searchUsers = (username) => {
    return request({
        method: 'GET',
        endpoint: 'users/searchUsers',
        params: {
            username
        }
    });
};

exports.createPost = ({ post, taggedUsers, hashtags, isPublic }) => {
    const body = { post };
    if (taggedUsers) body.taggedUsers = taggedUsers;
    if (hashtags) body.hashtags = hashtags;
    if (isPublic) body.isPublic = isPublic;
    return request({
        method: 'POST',
        endpoint: 'posts',
        body
    })
};

exports.commentOnPost = ({ comment, postId }) => {
    const body = { comment, postId };
    return request({
        method: 'POST',
        endpoint: 'posts/comment',
        body
    })
};

exports.getPosts = ({ skip, postLimit, global, hashtags }) => {

    console.log(global);

    return request({
        method: 'GET',
        endpoint: 'posts',
        params: {
            skip,
            limit: postLimit,
            global,
            hashtags
        }
    })
}

exports.getFriends = () => {
    return request({
        method: 'GET',
        endpoint: 'users/friends'
    })
}

exports.getFriendRequests = () => {
    return request({
        method: 'GET',
        endpoint: 'users/friendRequests'
    })
}