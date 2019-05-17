const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const FriendRequests = mongoose.model('FriendRequests');
const Q = require('q');
const asyncMiddleware = require('../../utils').asyncMiddleware;

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    Q.allSettled([
        Users.findOne({ username: user.username }),
        Users.findOne({ email: user.email })
    ]).then((results) => {
        let errorMessage;
        if (!user.email) errorMessage = 'email is required';
        if (!user.password) errorMessage = 'password is required';
        if (!user.username) errorMessage = 'username is required';
        if (results[0].value) errorMessage = 'this username is already taken';
        else if (results[1].value) errorMessage = 'this email is already taken. Have you already registered?';

        if (errorMessage) throw new Error(errorMessage);
        else return null;
    }).then(() => {
        const finalUser = new Users(user);
        finalUser.setPassword(user.password);
        return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }));
    }).catch((error) => {
        return res.status(422).json({ message: error.message });
    })
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    let errorMessage;
    if (!user.email) errorMessage = 'email is required';
    if (!user.password) errorMessage = 'password is required';
    if (errorMessage) return res.status(422).json({ message: errorMessage });

    return passport.authenticate('local', {
        session: false
    }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (info && info.errors) {
            return res.status(403).json(info.errors);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({
                user: user.toAuthJSON()
            });
        }

        return res.status(400).info;
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/profile', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({
                user: user.toAuthJSON()
            });
        });
});

router.post('/sendFriendRequest', auth.required, asyncMiddleware( async(req, res) => {
    const { payload } = req;
    const { body } = req;
    const fromId = payload.id;


    if (!body.id && !body.username) {
        return res.status(422).json('you must pass in --byId or --username params');
    }

    let toId;
    if (body.id) {
        toId = body.id;
    } else {
        const user = await Users.findOne({ username: body.username });
        toId = user._id;
    }

    const friendRequest = new FriendRequests({
        from: fromId,
        to: toId
    });

    friendRequest.save().then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(422).json(error);
    })
}));

router.post('/acceptFriendRequest', auth.required, asyncMiddleware( async(req, res) => {
    const { payload } = req;
    const { body } = req;
    const currentUserId = payload.id;

    if (!body.id && !body.username) {
        return res.status(422).json('you must pass in --byId or --username params');
    }

    let friendToAddId;
    if (body.id) {
        friendToAddId = body.id;
    } else {
        const user = await Users.findOne({ username: body.username });
        friendToAddId = user._id;
    }

    FriendRequests.findOne({ to: currentUserId, from: friendToAddId }).then((fr) => {
        if (fr.status === 'pending') {
            Q.allSettled([
                Users.findById(currentUserId),
                Users.findById(friendToAddId)
            ]).then((values) => {
                const currentUser = values[0].value;
                const friendAdded = values[1].value;
                currentUser.friends.push(friendToAddId);
                friendAdded.friends.push(currentUserId);
                fr.status = "accepted";
                return Q.allSettled([
                    currentUser.save(),
                    friendAdded.save(),
                    fr.save()
                ]);
            }).then((values) => {
                const friendAdded = values[1].value;
                res.json({
                    username: friendAdded.username
                });
            }).catch((error) => {
                res.status(422).json();
            })
        } else if (fr.status === 'accepted') {
            res.status(422).json('you have already accepted this request.')
        } else {
            res.status(422).json('you have already rejected this request.')
        }
    }).catch((error) => {
        res.json(error);
    })
}));

router.get('/searchUsers', auth.required, (req, res) => {
    Users.find().select('username email').then((users) => {
        res.json(users);
    }).catch((error) => {
        res.status(500).json(error);
    })
})

module.exports = router;