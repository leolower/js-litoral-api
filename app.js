var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// GENERAL MIDDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(cors());

var products = require('./data/products');
var comments = require('./data/comments');

// ROUTE DEFINITIONS
app.get('/products/:id', function (req, res, next) {
    var result = products.filter(function (product) {
        return product.id == req.params.id;
    });
    result = result[0];

    // res.send(result ? 200 : 404, result);
    if (result) {
        res.send(result);
    } else {
        res.send(404);
    }
});
app.get('/products', function (req, res, next) {
    res.send(products);
});
app.post('/products', function (req, res, next) {
    var newProduct = req.body;
    newProduct.id = uuid();
    products.push(newProduct);
    res.send(200, newProduct);
});
app.get('/products/:id/comments', function (req, res, next) {
    res.send(comments.filter(function (comment) {
        return comment.product_id === req.params.id;
    }));
});
app.post('/products/:id/comments', function (req, res, next) {
    var newComment = req.body;
    newComment.id = uuid();
    newComment.product_id = req.params.id;
    newComment.created_at = new Date();
    comments.push(newComment);
    res.send(200, newComment);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
