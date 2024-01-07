'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Feedback = require('../models/feedbackModel');

// GET user profile by ID
router.get('/', async (req, res) => {
    try {
        const username = res.locals.username;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('profile', { title: 'Profile', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to edit a profile
router.get('/edit/:id', async (req, res) => {
    const username = res.locals.username;
    const profileId = req.params.id;
    const user = await User.findById(profileId);
    const reqUser = user.username;
    if (reqUser === username) {
        try {
            res.render('editProfile', { title: "Edit Your Profile", user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    else {
        res.redirect('/auth');
    }
});

// PUT to edit a profile
router.post('/edit/:id', async (req, res) => {
    try {
        const profileId = req.params.id;
        const { username, email, password } = req.body;
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(profileId, { username, email, hashedPassword });
        await Product.updateMany({ username: username });
        await Feedback.updateMany({ username: username });
        req.session.username = username;
        res.locals.username = req.session.username;
        const user = await User.findOne({ username: username });
        res.render('profile', { title: 'Profile', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE a profile
router.get('/delete/:id', async (req, res) => {
    try {
        const profileId = req.params.id;
        const username = res.locals.username;
        await User.findOneAndDelete({ _id: profileId });
        await Product.deleteMany({ username: username });
        await Feedback.deleteMany({ username: username });
        res.redirect('/logout');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
