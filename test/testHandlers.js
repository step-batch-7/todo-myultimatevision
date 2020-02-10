const request = require('supertest');
const { app } = require('../lib/handlers.js');


describe('GET', function () {
  describe('GET home page', function () {
    it('should get the home page', function (done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .set('Cookie', '')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '801')
        .expect(/Login/, done);
    });

    it('should get the home page when /home.html', function (done) {
      request(app.serve.bind(app))
        .get('/home.html')
        .set('Accept', '*/*')
        .set('Cookie', 'user=sai; password=sai@16')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '1065')
        .expect(/Todo/, done);
    });
  });

  describe('not found page', function () {
    it('should get the not found page', function (done) {
      request(app.serve.bind(app))
        .get('/bad')
        .set('Accept', '*/*')
        .expect(404)
        .expect(/Not Found/, done);
    });
  });

})