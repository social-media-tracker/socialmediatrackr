'use strict';

var express = require('express');
var controller = require('./attachment.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
// Custom routes
router.get('/:id/passthru', controller.passthru);
router.get('/:id/download', controller.download);

module.exports = router;
