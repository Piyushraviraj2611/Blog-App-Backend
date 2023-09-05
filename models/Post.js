const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter post title'],
        trim: true,
        maxLength: [100, 'Post title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please enter post content'],
        trim: true,
    },
    meta: {
        type: String,
        required: [true, 'Please enter post meta'],
        trim: true,
    },
    tags: [String],
    author: {
        type: String,
        default: 'Admin',
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Please enter post slug'],
        unique: true,
        trim: true,
    },
    thumbnail: {
        type: Object,
        url: {
            type: String,
            // required: [true, 'Please enter post thumbnail url'],
            trim: true,
        },
        public_id: {
            type: String,
            // required: [true, 'Please enter post thumbnail public id'],
            trim: true,
        },
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Post', postSchema);