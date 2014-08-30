'use strict';

var _ = require('lodash');
var Attachment = require('./attachment.model');

// Get list of attachments
exports.index = function(req, res) {
  Attachment.find(function (err, attachments) {
    if(err) { return handleError(res, err); }
    return res.json(200, attachments);
  });
};

// Get a single attachment
exports.show = function(req, res) {
  Attachment.findById(req.params.id, function (err, attachment) {
    if(err) { return handleError(res, err); }
    if(!attachment) { return res.send(404); }
    return res.json(attachment);
  });
};

// Creates a new attachment in the DB.
exports.create = function(req, res) {
  Attachment.create(req.body, function(err, attachment) {
    if(err) { return handleError(res, err); }
    return res.json(201, attachment);
  });
};

// Updates an existing attachment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Attachment.findById(req.params.id, function (err, attachment) {
    if (err) { return handleError(res, err); }
    if(!attachment) { return res.send(404); }
    var updated = _.merge(attachment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, attachment);
    });
  });
};

// Deletes a attachment from the DB.
exports.destroy = function(req, res) {
  Attachment.findById(req.params.id, function (err, attachment) {
    if(err) { return handleError(res, err); }
    if(!attachment) { return res.send(404); }
    attachment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}