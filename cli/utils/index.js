const readline = require('readline');
const config = require('../config');
const keytar = require('keytar');
const keys = require('../keys');
var cloudinary = require('cloudinary').v2

exports.promptInput = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();
        });
    })
}

exports.isValidEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(String(email).toLowerCase());
    if (!valid) {
        return false;
    }
    return true;
}

exports.getCurrentUser = () => {
    return keytar.getPassword(config.keytar.service, config.keytar.account).then((user) => {
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }).catch(() => {
        return null;
    })
}

cloudinary.config({
    cloud_name: keys.CLOUDINARY_CLOUD_NAME,
    api_key: keys.CLOUDINARY_API_KEY,
    api_secret: keys.CLOUDINARY_API_SECRET
});

exports.uploadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagePath, {}, function(err, image) {
            if (err) {
                reject(err);
            } else {
                resolve(image);
            }
        })
    })
}