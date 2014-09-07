'use strict';

var express = require('express');
var controller = require('./attachment.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

// standard CRUD
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// Custom routes
router.get('/:id/passthru', controller.passthru);
router.get('/:id/download', controller.download);
router.post('/:id/updateName', auth.hasRole('admin'), controller.updateName);

module.exports = router;