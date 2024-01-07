const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating: Number,
    message: String,
    username: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;