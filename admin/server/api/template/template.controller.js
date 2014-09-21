'use strict';

var _ = require('lodash');
var Template = require('./template.model');

// Get list of templates
exports.index = function(req, res) {
  var q = {}
  if (req.query.type) q.type = req.query.type;
  Template.find(q).populate('cat').sort({message:1}).exec(function (err, templates) {
    if(err) { return handleError(res, err); }
    return res.json(200, templates);
  });
};

// Get a single template
exports.show = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    return res.json(template);
  });
};

// Creates a new template in the DB.
exports.create = function(req, res) {
  Template.create(req.body, function(err, template) {
    if(err) { return handleError(res, err); }
    return res.json(201, template);
  });
};

// Updates an existing template in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Template.findById(req.params.id, function (err, template) {
    if (err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    var updated = _.merge(template, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, template);
    });
  });
};

// Deletes a template from the DB.
exports.destroy = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    template.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}