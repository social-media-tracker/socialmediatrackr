'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('provider'), controller.index);
router.get('/providers', auth.hasRole('admin'), controller.providers);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/subscriptions', auth.isAuthenticated(), controller.changeSubscriptions);
router.get('/:clientId/addToProvider/:providerId', auth.hasRole('admin'), controller.addToProvider);
router.get('/:clientId/removeFromProvider/:providerId', auth.hasRole('admin'), controller.removeFromProvider);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.post('/', controller.create);

module.exports = router;
