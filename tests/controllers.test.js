const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('../server')

chai.should();

chai.use(chaiHttp);

const expect = chai.expect;

describe('Subscribe route', () => {
    it('should create topic when subscription does not exist', (done) => {
        chai.request(app)
        .post(`/subscribe/newtopic`)
        .send({'url': 'https://mysubscriber.test'})
        .end((err, res) => {
            res.status.should.equal(200)
            res.body.should.be.a('object')
            res.body.url.should.equal('https://mysubscriber.test')
            res.body.topic.should.equal('newtopic')
            done();
        });
    });

    it('should return a 400 when an invalid url is provided', (done) => {
        chai.request(app)
        .post(`/subscribe/newtopic`)
        .send({'url': 'invalid string'})
        .end((err, res) => {
            res.status.should.equal(400)
            res.body.should.be.a('object')
            res.body.message.should.equal('provided url is invalid')
            done();
        });

    })

    it('should create topic when subscription already exist', (done) => {
        chai.request(app)
        .post('/subscribe/newtopic')
        .send({'url': 'https://mysubscriber.test'})
        .end((err, res) => {
            res.status.should.equal(200)
            res.body.should.be.a('object')
            res.body.url.should.equal('https://mysubscriber.test')
            res.body.topic.should.equal('newtopic')
            chai.request(app)
            .post('/subscribe/newtopic')
            .send({'url': 'https://mysubscriber.test2'})
            .end((err, res) => {
                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.url.should.equal('https://mysubscriber.test2')
                res.body.topic.should.equal('newtopic')
                done()
            })
        });
    });
});



describe('Publish route', () => {

    it('should return an error when topic does not exist', (done) => {
        chai.request(app)
        .post(`/publish/nonexistentTopic`)
        .send({
            "testing": {
                "anotherNested": "A nested example"
            }
        })
        .end((err, res) => {
            res.status.should.equal(400)
            res.body.should.be.a('object')
            res.body.message.should.equal('There are no subscriptions for that topic')
            done();
        });
    });


    it('should return successful count when the topic exists', (done) => {
        chai.request(app)
        .post('/subscribe/existingTopic')
        .send({'url': 'https://jsonplaceholder.typicode.com/posts'})
        .end((err, res) => {
            res.status.should.equal(200)
            res.body.should.be.a('object')
            res.body.url.should.equal('https://jsonplaceholder.typicode.com/posts')
            res.body.topic.should.equal('existingTopic')
            chai.request(app)
            .post('/publish/existingTopic')
            .send({
                "testing": {
                    "anotherNested": "A nested example"
                }
            })
            .end((err, res) => {
                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.message.should.equal('Successfully published to 1 subscriber(s)')
                done()
            })
        });
    });


    it('should not add multiple instances of the same url', (done) => {
        chai.request(app)
        .post('/subscribe/existingTopic')
        .send({'url': 'https://jsonplaceholder.typicode.com/posts'})
        .send({'url': 'https://jsonplaceholder.typicode.com/posts'})
        .send({'url': 'https://jsonplaceholder.typicode.com/posts'})
        .end((err, res) => {
            res.status.should.equal(200)
            res.body.should.be.a('object')
            res.body.url.should.equal('https://jsonplaceholder.typicode.com/posts')
            res.body.topic.should.equal('existingTopic')
            chai.request(app)
            .post('/publish/existingTopic')
            .send({
                "testing": {
                    "anotherNested": "A nested example"
                }
            })
            .end((err, res) => {
                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.message.should.equal('Successfully published to 1 subscriber(s)')
                done()
            })
        });
    });


});