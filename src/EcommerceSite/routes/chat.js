'use strict';
var express = require('express');
var router = express.Router();

/* GET chat. */
router.get('/', function (req, res) {
    const username = res.locals.username;
    res.render('chat', { title: "Chat", username });
});

module.exports = router;    
