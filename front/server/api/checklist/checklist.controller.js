'use strict';

var _ = require('lodash');
var Checklist = require('./checklist.model');

// Get list of checklists
exports.index = function(req, res) {
  Checklist.find({user:req.user._id}).sort('-createdAt').exec(function (err, checklists) {
    if(err) { return handleError(res, err); }
    var ll = []
    for (var i=0;i<checklists.length;i++) {
      var o = checklists[i];
      var oo = {
        isDone: o.completedAt ? 1 : 0,
        _id: o._id,
        task: o.task,
        completedAt: o.completedAt,
        createdAt: o.createdAt,
        modifiedAt: o.modifiedAt,
        user: o.user
      }
      ll.push(oo);
    }
    return res.json(200, ll);
  });
};

// Get a single checklist
exports.show = function(req, res) {
  Checklist.findById(req.params.id, function (err, checklist) {
    if(err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    return res.json(checklist);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}