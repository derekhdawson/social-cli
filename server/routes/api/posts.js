const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Posts = mongoose.model('Posts');
const Comments = mongoose.model('Comments');
const FriendRequests = mongoose.model('FriendRequests');
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

router.post('/comment', auth.required, asyncMiddleware(async (req, res) => {
    const { payload } = req;
    const { body } = req;

    if (!body.comment || !body.postId) {
        return res.status(422).json('you must pass in --comment and --postId params');
    }    

    const newComment = new Comments({
        user: payload.id,
        comment: body.comment,
        postId: body.postId
    });

    try {
        const comment = await newComment.save();
        const post = await Posts.findById(body.postId);
        post.comments.push(comment);
        await post.save();
        res.json('your comment was added to this post');
    } catch (error) {
        res.status(500).error(error);
    }
}));

router.get('/', auth.required, asyncMiddleware(async (req, res) => {
    const { payload } = req;
    const { body } = req;

    try {

        const user = await Users.findById(payload.id);
        console.log(user.friends);


        const posts = await Users.find({ })
            .select('-_id -__v -updatedAt')
            .populate({
                path: 'comments',
                select: 'comment -_id'
            })
            .populate({
                path: 'taggedUsers',
                select: 'username -_id'
            })
            .populate({
                path: 'user',
                select: 'username -_id'
            })
        return res.json(posts);
    } catch (error) {
        return res.status(500).error(error);
    }
}))

module.exports = router;