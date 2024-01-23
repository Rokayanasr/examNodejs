const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    body: {
        type: String,
        required: true,
    },
    photo: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: []
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
