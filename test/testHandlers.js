const request = require('supertest');
const { app } = require('../lib/handlers');


describe('GET', function () {
  describe('GET login page', function () {
    it('should get the login page', function (done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '801')
        .expect(/Login/, done);
    });

    it('should get the login page', function (done) {
      request(app.serve.bind(app))
        .get('/login.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '801')
        .expect(/Login/, done);
    });

    it('should redirectTo login page for /home.html when cookie not present', function (done) {
      request(app.serve.bind(app))
        .get('/home.html')
        .set('Accept', '*/*')
        .expect(301)
        .expect('location', '/entry.html')
        .expect('', done);
    });
  });

  describe('GET home page', function () {
    it('should get the redirect for / and cookie is present', function (done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .set('Cookie', 'user=sai; password=sai@16')
        .expect(301)
        .expect('location', '/home.html')
        .expect('', done);
    });

    it('should get the home page for /home.html', function (done) {
      request(app.serve.bind(app))
        .get('/home.html')
        .set('Accept', '*/*')
        .set('Cookie', 'user=sai; password=sai@16')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '1065')
        .expect(/Todo/, done);
    });

    it('should redirect home page for /login.html when cookie is present', function (done) {
      request(app.serve.bind(app))
        .get('/login.html')
        .set('Accept', '*/*')
        .set('Cookie', 'user=sai; password=sai@16')
        .expect(301)
        .expect('location', '/home.html')
        .expect('', done);
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

  describe('/serveTodos', function () {
    it('should get todos', function (done) {
      request(app.serve.bind(app))
        .get('/serveTodos')
        .set('Accept', '*/*')
        .expect(200)
        .expect(/"title":"todo app"/, done);
    });
  });
})