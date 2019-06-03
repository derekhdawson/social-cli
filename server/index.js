const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const config = require('./config');

mongoose.promise = global.Promise;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());

if (!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect(config.MONGO_CONNECTION, { useNewUrlParser: true }).then(() => {
    console.log('connected to mlab');
}).catch((error) => {
    console.log(error);
});
mongoose.set('debug', true);

require('./models/Users');
require('./models/FriendRequests');
require('./models/Posts');
require('./models/Comments');
require('./config/passport');
app.use(require('./routes'));

//Error handlers & middlewares
if (!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}







const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on ${isProduction ? `port ${process.env.PORT}` : 'http://localhost:8000/'}`));
