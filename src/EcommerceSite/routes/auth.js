'use strict';
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

/* GET auth page. */
router.get('/', function (req, res) {
    res.render('auth', { title: 'Authentication' });       
});

router.get('/login', function (req, res) {
    const logged = res.locals.logged;
    if (logged) {
        res.redirect('/index');
    }
    else {
        res.render('login', { title: 'Login' });
    }
});

router.post('/login', async function (req, res) {
    const { username, password } = req.body;

    try {
        // Find the user by username in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('No user exists');
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        } else {
            // Authentication logic
            req.session.logged = true;
            console.log(req.session.logged);
            req.session.username = username;
            res.redirect('/index');
            // Authentication successful
            console.log('Login successful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/register', function (req, res) {
    const logged = res.locals.logged;
    if (logged) {
        res.redirect('/index');
    }
    else {
        res.render('register', { title: 'Register' });
    }
});

router.post('/register', async function (req, res) {
    const { email, username, password } = req.body;

    // Save the user to the database
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).send('User with this username already exists.');
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            username,
            password : hashedPassword,
        });

        // Save the user to the database using async/await
        await newUser.save();

        // Authentication logic
        req.session.logged = true;
        console.log(req.session.logged);
        req.session.username = username;

        // Redirect to the index page with user details
        res.redirect(`/index`);
        console.log("User successfully registered");
    } catch (err) {
        console.error(err);
        res.send('Error registering user.');
    }
});

module.exports = router;
