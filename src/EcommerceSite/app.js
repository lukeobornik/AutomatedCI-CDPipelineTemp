'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const http = require('http');
const socketIo = require('socket.io');

var routes = require('./routes');
var products = require('./routes/products');
var feedback = require('./routes/feedback');
var chat = require('./routes/chat');
var profile = require('./routes/profile');
var auth = require('./routes/auth');

const db = require('./db');

var app = express();
const sockServer = http.createServer(app);
const io = socketIo(sockServer);

// Set the view engine to PUG
app.set('view engine', 'pug');

// Tell Express where to find the views (HTML files)
app.set('views', path.join(__dirname, 'views')); // Update the path according to your project structure

// Set up a static directory for serving HTML files
app.use(express.static(path.join(__dirname, 'public'))); // Update the path for your static files

// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = "bKvMrgdKJb3$JoNWKDSgL56$£";
const userId = uuid.v4();
app.use(session({
    secret: sessionSecret, // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: true,
}));

// Custom middleware for globally accessible session variables
app.use((req, res, next) => {
    res.locals.logged = req.session.logged || false;
    console.log(res.locals.logged);
    req.session.userId = userId;
    res.locals.username = req.session.username || "Guest" + req.session.userId;
    next();
});

app.use('/index', routes);
app.use('/products', products);
app.use('/feedback', feedback);
app.use('/chat', chat);
app.use('/profile', profile);
app.use('/auth', auth);

// Serve the socket.io.js file
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

// Socket.io setup 
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = sockServer.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});