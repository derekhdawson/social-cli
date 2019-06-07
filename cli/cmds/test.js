const terminalImage = require('terminal-image');
const got = require('got');
const keys = require('../keys');
var cloudinary = require('cloudinary').v2

module.exports = async (args) => {

    const {body} = await got('http://res.cloudinary.com/dq17bbwxk/image/upload/v1559691068/ue6ohinzjikzk57v3x4s.png', {encoding: null});
    console.log(await terminalImage.buffer(body));
    

    cloudinary.config({
        cloud_name: keys.CLOUDINARY_CLOUD_NAME,
        api_key: keys.CLOUDINARY_API_KEY,
        api_secret: keys.CLOUDINARY_API_SECRET
    });

    cloudinary.uploader.upload('/Users/derekdawson/Desktop/image.png', {}, function(err, image) {
        if (err) {
            console.log(err);
        } else {
            console.log(image);
        }
    })
}