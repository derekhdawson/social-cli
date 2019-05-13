const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Q = require('q');

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
    const {
        body: {
            user
        }
    } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', {
        session: false
    }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({
                user: user.toAuthJSON()
            });
        }

        return status(400).info;
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/profile', auth.required, (req, res, next) => {
    const {
        payload: {
            id
        }
    } = req;

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

module.exports = router;