
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    module.exports = {
        PASSPORT_SECRET: process.env.PASSPORT_SECRET,
        MONGO_CONNECTION: process.env.MONGO_CONNECTION
    }
} else {
    const keys = require('../keys');
    module.exports = {
        PASSPORT_SECRET: keys.PASSPORT_SECRET,
        MONGO_CONNECTION: keys.MONGO_CONNECTION
    }
}