'use strict';
var express = require('express');
var router = express.Router();
const Feedback = require('../models/feedbackModel');

/* GET feedback. */
router.get('/', async function (req, res) {
    try {
        const feed = await Feedback.find();
        res.render('feedback', { title: 'Feedback', feed });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to edit a feedback
router.post('/', async function (req, res) {
    try {
        const { message, rating } = req.body;
        const username = res.locals.username;
        const newFeedback = new Feedback({
            rating,
            message,
            username
        });
        await newFeedback.save();
        res.redirect('/feedback');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to edit a feedback
router.get('/edit/:id', async function (req, res) {
    try {
        const feedbackId = req.params.id;
        const feed = await Feedback.findById(feedbackId);
        try {
            res.render('editFeedback', { title: "Feedback", feed });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT to edit a feedback
router.post('/edit/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const { rating, message } = req.body;
        await Feedback.findByIdAndUpdate(feedbackId, { rating, message });
        res.redirect('/feedback');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/delete/:id', async function (req, res) {
    try {
        const feedbackId = req.params.id;
        await Feedback.findByIdAndDelete(feedbackId);
        res.redirect('/feedback');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;