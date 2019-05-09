const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const keys = require('./keys');

mongoose.promise = global.Promise;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(session({
    secret: keys.PASSPORT_SECRET,
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}));

if (!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect(keys.MONGO_CONNECTION, { useNewUrlParser: true }).then(() => {
    console.log('connected to mlab');
}).catch((error) => {
    console.log(error);
});
mongoose.set('debug', true);

require('./models/Users');
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

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
