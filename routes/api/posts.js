const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Posts = mongoose.model('Posts');
const asyncMiddleware = require('../../utils').asyncMiddleware;

router.post('/', auth.required, asyncMiddleware(async (req, res) => {
    const { payload } = req;
    const { body } = req;

    if (!body.post) {
        return res.status(422).json('you must pass in --post param');
    }

    let taggedUsers;
    if (body.taggedUsers) {
        try {
            const users = await Users.find({
                username: {
                    $in: body.taggedUsers
                }
            });
            const ids = users.map(user => user._id);
            taggedUsers = ids;
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    let post = body.post;
    let hashtags = body.hashtags;
    let user = payload.id;

    const newPost = new Posts({
        user,
        post,
        taggedUsers,
        hashtags
    });

    try {
        await newPost.save();
        return res.json(newPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}));

module.exports = router;