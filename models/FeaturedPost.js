const mongoose = require('mongoose');

const featuredPostSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Please select a post']
    },
}, { timestamps: true });

module.exports = mongoose.model('FeaturedPost', featuredPostSchema);