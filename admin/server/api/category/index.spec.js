'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* category.controller stub */
var categoryCtrl = {
      index: 'categoryCtrl.index',
      show: 'categoryCtrl.show',
      create: 'categoryCtrl.create',
      update: 'categoryCtrl.update',
      destroy: 'categoryCtrl.destroy'
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy(),
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()
    },
    /* stubbed category router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './category.controller': categoryCtrl
    });

describe('Category API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/cats', function() {

    it('should route to category.controller.index', function() {
      return router.get.withArgs('/', 'categoryCtrl.index').should.have.been.calledOnce;
    });

  });

  describe('GET /api/cats/:id', function() {

    it('should route to category.controller.show', function() {
      return router.get.withArgs('/:id', 'categoryCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/cats', function() {

    it('should route to category.controller.create', function() {
      return router.post.withArgs('/', 'categoryCtrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/cats/:id', function() {

    it('should route to category.controller.update', function() {
      return router.put.withArgs('/:id', 'categoryCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/cats/:id', function() {

    it('should route to category.controller.update', function() {
      return router.patch.withArgs('/:id', 'categoryCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/cats/:id', function() {

    it('should route to category.controller.destroy', function() {
      return router.delete.withArgs('/:id', 'categoryCtrl.destroy').should.have.been.calledOnce;
    });

  });

});
