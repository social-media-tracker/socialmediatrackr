'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* task.controller stub */
var taskCtrl = {
      index: 'taskCtrl.index',
      show: 'taskCtrl.show',
      create: 'taskCtrl.create',
      update: 'taskCtrl.update',
      destroy: 'taskCtrl.destroy'
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy(),
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()
    },
    /* stubbed task router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './task.controller': taskCtrl
    });

describe('Task API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/tasks', function() {

    it('should route to task.controller.index', function() {
      return router.get.withArgs('/', 'taskCtrl.index').should.have.been.calledOnce;
    });

  });

  describe('GET /api/tasks/:id', function() {

    it('should route to task.controller.show', function() {
      return router.get.withArgs('/:id', 'taskCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/tasks', function() {

    it('should route to task.controller.create', function() {
      return router.post.withArgs('/', 'taskCtrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/tasks/:id', function() {

    it('should route to task.controller.update', function() {
      return router.put.withArgs('/:id', 'taskCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/tasks/:id', function() {

    it('should route to task.controller.update', function() {
      return router.patch.withArgs('/:id', 'taskCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/tasks/:id', function() {

    it('should route to task.controller.destroy', function() {
      return router.delete.withArgs('/:id', 'taskCtrl.destroy').should.have.been.calledOnce;
    });

  });

});
