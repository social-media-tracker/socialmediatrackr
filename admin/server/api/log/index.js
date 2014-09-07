'use strict';

var express = require('express');
var controller = require('./log.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// standard CRUD routes
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// custom routes
router.post('/:id/upload', auth.hasRole('admin'), controller.upload);
router.post('/upload', auth.hasRole('admin'), controller.upload);

module.exports = router;
