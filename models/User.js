const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 2,
    },

    email: {
        type: String,
        required: true,
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],

    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }]
})

const User = mongoose.model('User', UserSchema);
User.createIndexes({ title: "text", author: "text", tags: "text" });
module.exports = User;
