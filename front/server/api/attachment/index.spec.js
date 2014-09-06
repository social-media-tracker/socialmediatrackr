'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* attachment.controller stub */
var attachmentCtrl = {
      index: 'attachmentCtrl.index',
      show: 'attachmentCtrl.show',
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy(),
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()
    },
    /* stubbed attachment router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './attachment.controller': attachmentCtrl
    });

describe('Attachment API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/attachments', function() {

    it('should route to attachment.controller.index', function() {
      return router.get.withArgs('/', 'attachmentCtrl.index').should.have.been.calledOnce;
    });

  });

  describe('GET /api/attachments/:id', function() {

    it('should route to attachment.controller.show', function() {
      return router.get.withArgs('/:id', 'attachmentCtrl.show').should.have.been.calledOnce;
    });

  });


});
