'use strict';

var express = require('express');
var controller = require('./attachment.controller');

var router = express.Router();

// standard CRUD
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

// Custom routes
router.get('/:id/passthru', controller.passthru);
router.get('/:id/download', controller.download);
router.post('/:id/updateName', controller.updateName);

module.exports = router;