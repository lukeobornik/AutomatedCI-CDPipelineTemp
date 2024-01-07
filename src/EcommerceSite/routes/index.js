'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
    res.render('index', { title: 'Home Page', username: res.locals.username });
});

module.exports = router;
