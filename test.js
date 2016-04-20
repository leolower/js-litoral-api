var test = require('tape');
var request = require('supertest');
var app = require('./app');
// var app = 'http://localhost:3000';

test('Products', function (t) {
    t.plan(4);

    request(app)
        .get('/products')
        .set('Accept', 'application/json')
        .end(function (err, res) {
            t.error(err);
            t.ok(res.body.length > 0);
            t.equal(res.body[0].id, '1');
            t.equal(typeof res.body[0].name, 'string');
        });

    test('GET /:id', function (t) {
        t.plan(3);

        request(app)
            .get('/products/1')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                t.error(err);
                t.equal(res.body.id, '1');
                t.equal(typeof res.body.name, 'string');
            });
    });
    test('POST /', function (t) {
        t.plan(6);

        var newPrduct = {
            name: 'new product ' + Math.random()
        };

        request(app)
            .post('/products')
            .send(newPrduct)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                t.error(err);
                t.ok(res.body.id);
                t.equal(res.body.name, newPrduct.name);

                request(app)
                    .get('/products/' + res.body.id)
                    .set('Accept', 'application/json')
                    .end(function (getError, getResponse) {
                        t.error(getError);
                        t.equal(getResponse.body.id, res.body.id);
                        t.equal(getResponse.body.name, newPrduct.name);
                    });
            });
    });
});

test('Comments', function (t) {
    t.plan(1);
    t.ok(true);

    test('GET /products/1/comments', function (t) {
        t.plan(3);

        request(app)
            .get('/products/1/comments')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                t.error(err);
                t.ok(res.body.length > 0);
                t.equal(typeof res.body[0].id, 'string');
            });
    });
    test('POST /products/:id/comments', function (t) {
        t.plan(8);

        var newComment = {
            text: 'new comment ' + Math.random()
        };

        request(app)
            .post('/products/1/comments')
            .send(newComment)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                t.error(err);
                t.equal(res.statusCode, 200);
                t.ok(res.body.id);
                t.equal(res.body.text, newComment.text);

                request(app)
                    .get('/products/1/comments')
                    .set('Accept', 'application/json')
                    .end(function (getError, getResponse) {
                        t.error(getError);
                        t.equal(res.statusCode, 200);
                        var createdComment = getResponse.body.filter(function (comment) {
                            return comment.text === newComment.text;
                        });
                        t.ok(createdComment.length > 0);
                        t.ok(createdComment[0].created_at);
                    });
            });
    });
});
