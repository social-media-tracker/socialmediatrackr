'use strict';

var _ = require('lodash');
var Attachment = require('./attachment.model');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

// Get list of attachments
exports.index = function(req, res) {
  var q = {}
  if (req.query.log) {
    q.log = req.query.log;
  }
  Attachment.find(q, function (err, attachments) {
    if(err) { return handleError(res, err); }
    var aa = [];

    for (var i in attachments) {
      aa.push(attachments[i].data);
    }

    return res.json(200, aa);
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

exports.updateName = function(req, res) {
  var id = req.params.id,
      newName = req.body.name;
  Attachment.findById(req.params.id, function (err, attachment) {
    attachment.name = newName;
    attachment.save(function(err) {
      if (err) return handleError(res, err);
      res.send(200, attachment);
    });
  });
};

exports.passthru = function(req, res) {
  var id = req.params.id;
  var attach_dir = path.normalize(path.join(__dirname, '../../../../attachments'));

  Attachment.findById(req.params.id, function (err, attachment) {
    res.sendfile(attachment.full_path);

  });
};

exports.download = function(req, res) {
  var id = req.params.id;
  var attach_dir = path.normalize(path.join(__dirname, '../../../../attachments'));
  Attachment.findById(req.params.id, function (err, attachment) {
    var fp = attachment.full_path;
    var mimetype = mime.lookup(fp);
    res.setHeader('Content-disposition', 'attachment; filename=' + attachment.filename);
    res.setHeader('Content-type', mimetype);
    fs.createReadStream(fp).pipe(res);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}