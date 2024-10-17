// models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // связь с моделью User
});

module.exports = mongoose.model('Article', articleSchema);
