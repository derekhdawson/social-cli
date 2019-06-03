const mongoose = require('mongoose');

const { Schema } = mongoose;

const Posts = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    post: {
        type: Schema.Types.String,
        required: true
    },
    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comments'
        }],
        default: []
    },
    hashtags: {
        type: [{
            type: Schema.Types.String
        }],
        default: []
    },
    taggedUsers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }],
        default: []
    },
    isPublic: {
        type: Schema.Types.Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

mongoose.model('Posts', Posts);
