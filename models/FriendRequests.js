const mongoose = require('mongoose');

const { Schema } = mongoose;

const FriendRequests = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    }
});

mongoose.model('FriendRequests', FriendRequests);
