'use strict';

var express = require('express');
var controller = require('./attachment.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

// standard CRUD
router.get('/', auth.auth.hasRole('admin'), controller.index);
router.get('/:id', auth.auth.hasRole('admin'), controller.show);
router.post('/', auth.auth.hasRole('admin'), controller.create);
router.put('/:id', auth.auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.auth.hasRole('admin'), controller.destroy);

// Custom routes
router.get('/:id/passthru', controller.passthru);
router.get('/:id/download', controller.download);
router.post('/:id/updateName', auth.auth.hasRole('admin'), controller.updateName);

module.exports = router;