const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Posts = mongoose.model('Posts');
const Comments = mongoose.model('Comments');
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

    const { post, hashtags, imageURL } = body;
    const user = payload.id;
    const isPublic = !!body.isPublic;

    const newPost = new Posts({
        user,
        post,
        taggedUsers,
        hashtags,
        isPublic,
        imageURL
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
    const skip = parseInt(req.query.skip, 10);
    const limit = parseInt(req.query.limit, 10);
    let global = req.query.global === 'true';
    let { hashtags, taggedIn } = req.query;

    try {
        const user = await Users.findById(payload.id);

        let queryCondition;

        if (!global) {
            queryCondition = { user: { $in: user.friends } };
        } else {
            queryCondition = { isPublic: true };
        }

        if (hashtags) {
            queryCondition = {
                ...queryCondition,
                hashtags: { $in: hashtags }
            };
        }

        if (taggedIn) {
            queryCondition = {
                ...queryCondition,
                taggedUsers: { $in: payload.id }
            }
        }

        const count = await Posts.countDocuments(queryCondition);

        const posts = await Posts.find(queryCondition)
            .skip(skip)
            .limit(limit)
            .select('-__v -updatedAt')
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
            .sort('-createdAt')
        return res.json({
            posts,
            totalNumPosts: count
        });


    } catch (error) {
        return res.status(500).json(error);
    }
}))

module.exports = router;