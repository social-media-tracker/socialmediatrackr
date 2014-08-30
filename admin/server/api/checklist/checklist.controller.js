'use strict';

var _ = require('lodash');
var Checklist = require('./checklist.model');
var Log = require('../log/log.model');
var ObjectId = require('mongoose').Types.ObjectId;

// Get list of checklists
exports.index = function(req, res) {
  var fixList = function (checklists) {
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
    return ll;
  }

  if (req.user.role === 'admin') {
    var q = {}

    if (req.query.user && req.query.user !== "0") {
      q.user = req.query.user;

    }
    if (!q.user) {
      Checklist.find().sort('-createdAt').populate('user').exec(function (err, checklists) {
        if(err) { return handleError(res, err); }
        return res.json(200, fixList(checklists));

      });
    } else {
      Checklist.find(q).sort('-createdAt').exec(function (err, checklists) {
        if(err) { return handleError(res, err); }
        return res.json(200, fixList(checklists));
      });
    }

  } else {
    // normal user
    Checklist.find({user:parseInt(req.user._id)}).sort('-createdAt').exec(function (err, checklists) {
      if(err) { return handleError(res, err); }
      return res.json(200, fixList(checklists));
    });
  }

  
};

exports.completed = function(req, res) {
  Checklist.findByIdAndUpdate(req.params.id, {$set:{completedAt:new Date().toISOString()}}, function (err, checklist) {
    if(err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    Log.create({user:checklist.user, checklist:checklist._id, message: 'Completed: ' + checklist.task}, function(err, log) {
      if(err) { return handleError(res, err); }
      return res.json(200, {completedAt:checklist.completedAt});
    });
  });
}

exports.notCompleted = function(req, res) {
  Checklist.findByIdAndUpdate(req.params.id, {$unset:{completedAt:''}}, function (err, checklist) {
    if(err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    Log.remove({checklist: ObjectId(checklist._id)}, function (err) {
      if(err) { return handleError(res, err); }
      return res.json(200, {checklist: ObjectId(checklist._id)});
    });
  });
}

// Get a single checklist
exports.show = function(req, res) {
  Checklist.findById(req.params.id, function (err, checklist) {
    if(err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    return res.json(checklist);
  });
};

// Creates a new checklist in the DB.
exports.create = function(req, res) {
  Checklist.create(req.body, function(err, checklist) {
    if(err) { return handleError(res, err); }
    return res.json(201, checklist);
  });
};

// Updates an existing checklist in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Checklist.findById(req.params.id, function (err, checklist) {
    if (err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    var updated = _.merge(checklist, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, checklist);
    });
  });
};

// Deletes a checklist from the DB.
exports.destroy = function(req, res) {
  Checklist.findById(req.params.id, function (err, checklist) {
    if(err) { return handleError(res, err); }
    if(!checklist) { return res.send(404); }
    checklist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}