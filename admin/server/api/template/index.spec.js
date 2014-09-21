'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* template.controller stub */
var templateCtrl = {
      index: 'templateCtrl.index',
      show: 'templateCtrl.show',
      create: 'templateCtrl.create',
      update: 'templateCtrl.update',
      destroy: 'templateCtrl.destroy'
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy(),
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()
    },
    /* stubbed template router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './template.controller': templateCtrl
    });

describe('Template API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/templates', function() {

    it('should route to template.controller.index', function() {
      return router.get.withArgs('/', 'templateCtrl.index').should.have.been.calledOnce;
    });

  });

  describe('GET /api/templates/:id', function() {

    it('should route to template.controller.show', function() {
      return router.get.withArgs('/:id', 'templateCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/templates', function() {

    it('should route to template.controller.create', function() {
      return router.post.withArgs('/', 'templateCtrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/templates/:id', function() {

    it('should route to template.controller.update', function() {
      return router.put.withArgs('/:id', 'templateCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/templates/:id', function() {

    it('should route to template.controller.update', function() {
      return router.patch.withArgs('/:id', 'templateCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/templates/:id', function() {

    it('should route to template.controller.destroy', function() {
      return router.delete.withArgs('/:id', 'templateCtrl.destroy').should.have.been.calledOnce;
    });

  });

});
