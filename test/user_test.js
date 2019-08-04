const supertest = require('supertest');
const server = supertest.agent('http://localhost:3000');
const should = require('should')
var accesskey = "";
var refresh_token = "";

describe('TEST API /users/register', function () {
    it('not enough req params', function (done) {
        server
            .post('/api/users/register')
            .send({ email: 'a@1' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('fail');
                done()
            })
    });
    it('full data', function (done) {
        server
            .post('/api/users/register')
            .send({
                email: 'a@' + new Date().getTime(),
                password: '1',
                firstname: 'trong',
                lastname: 'nv',
                company: 'ows'
            })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                // res.status.should.equal(200)
                res.body.status.should.equal('success')
                res.body.data.should.have.property('accesskey')
                res.body.data.should.have.property('refresh_token')
                done()
            })
    });
});


describe('TEST API /users/login', function () {
    it('empty email', function (done) {
        server
            .post('/api/users/login')
            .send({ password: '1' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('fail');
                done()
            })
    });
    it('empty password', function (done) {
        server
            .post('/api/users/login')
            .send({ email: 'a@1' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('fail');
                done()
            })
    });
    it('password wrong', function (done) {
        server
            .post('/api/admins/login')
            .send({ email: 'a@1', password: '2' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('error')
                done()
            })
    });
    it('full data', function (done) {
        server
            .post('/api/users/login')
            .send({ email: 'a@1', password: '1' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                accesskey = res.body.data.accesskey;
                refresh_token = res.body.data.refresh_token;
                res.body.status.should.equal('success')
                res.body.data.should.have.property('accesskey')
                res.body.data.should.have.property('refresh_token')
                done()
            })
    });
});

describe('TEST API /users/reset-password', function () {
    it('not auth', function (done) {
        server
            .put('/api/users/reset-password')
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('error');
                done()
            })
    });
    it('not password', function (done) {
        server
            .put('/api/users/reset-password')
            .set('Authorization', 'Bearer ' + accesskey)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('error');
                done()
            })
    });
    it('full data', function (done) {
        server
            .put('/api/users/reset-password')
            .set('Authorization', 'Bearer ' + accesskey)
            .send({ password: '1' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('success')
                done()
            })
    });
});

describe('TEST API GET PROFILE /users/me', function () {
    it('not auth', function (done) {
        server
            .get('/api/users/me')
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('error');
                done()
            })
    });
    it('full data', function (done) {
        server
            .get('/api/users/me')
            .set('Authorization', 'Bearer ' + accesskey)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.data.should.be.an.Object()
                res.body.status.should.equal('success');
                done()
            })
    });
});


describe('TEST API UPDATE PROFILE /users/me', function () {
    it('not auth', function (done) {
        server
            .put('/api/users/me')
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('error');
                done()
            })
    });
    it('full data', function (done) {
        server
            .put('/api/users/me')
            .set('Authorization', 'Bearer ' + accesskey)
            .send({ 'firstname': 'trongnv' })
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.body.status.should.equal('success');
                done()
            })
    });
});