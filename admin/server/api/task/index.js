'use strict';

var express = require('express');
var controller = require('./task.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.post('/:id/completed', auth.hasRole('admin'), controller.completed);
router.post('/:id/uncompleted', auth.hasRole('admin'), controller.uncompleted);

router.get('/:id/logs/:log_id/attachments/:attach_id/view', controller.passthruLogAttachment);
router.get('/:id/logs/:log_id/attachments/:attach_id/download', controller.downloadLogAttachment);
router.delete('/:id/logs/:log_id/attachments/:attach_id', controller.deleteAttachment);
router.post('/:id/logs', auth.isAuthenticated(), controller.postLog);
router.post('/:id/logs/:log_id/comments', auth.isAuthenticated(), controller.postLogComment);
router.post('/:id/logs/:log_id/attachments', auth.isAuthenticated(), controller.uploadLogAttachment);


module.exports = router;