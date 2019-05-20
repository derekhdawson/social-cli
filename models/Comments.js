const mongoose = require('mongoose');

const { Schema } = mongoose;

const Comments = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    comment: {
        type: Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});

mongoose.model('Comments', Comments);
