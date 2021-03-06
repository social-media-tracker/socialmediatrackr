'use strict';

var app = require('../../app');
var request = require('supertest');

var newCategory;

describe('Category API:', function() {

  describe('GET /api/cats', function() {
    var categorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/cats')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          categorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      categorys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/cats', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cats')
        .send({
          name: 'New Category',
          info: 'This is the brand new category!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          newCategory = res.body;
          done();
        });
    });

    it('should respond with the newly created category', function() {
      newCategory.name.should.equal('New Category');
      newCategory.info.should.equal('This is the brand new category!!!');
    });

  });

  describe('GET /api/cats/:id', function() {
    var category;

    beforeEach(function(done) {
      request(app)
        .get('/api/cats/' + newCategory._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          category = res.body;
          done();
        });
    });

    afterEach(function() {
      category = {};
    });

    it('should respond with the requested category', function() {
      category.name.should.equal('New Category');
      category.info.should.equal('This is the brand new category!!!');
    });

  });

  describe('PUT /api/cats/:id', function() {
    var updatedCategory

    beforeEach(function(done) {
      request(app)
        .put('/api/cats/' + newCategory._id)
        .send({
          name: 'Updated Category',
          info: 'This is the updated category!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          updatedCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCategory = {};
    });

    it('should respond with the updated category', function() {
      updatedCategory.name.should.equal('Updated Category');
      updatedCategory.info.should.equal('This is the updated category!!!');
    });

  });

  describe('DELETE /api/cats/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/cats/' + newCategory._id)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should respond with 404 when category does not exsist', function(done) {
      request(app)
        .delete('/api/cats/' + newCategory._id)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

  });

});
