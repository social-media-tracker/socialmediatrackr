'use strict';

var _ = require('lodash');
var Log = require('./log.model');
var moment = require('moment');

// Get list of logs
exports.index = function(req, res) {
  // admin user
  if (req.user.role === 'admin') {
    var q = {}

    if (req.query.user && req.query.user !== "0") {
      q.user = req.query.user;
    }

    if (q === {}) {
      Log.find().sort('-createdAt').populate('user').exec(function (err, logs) {
        if(err) { return handleError(res, err); }
        return res.json(200, logs);

      });
    } else {
      Log.find(q).sort('-createdAt').populate('user').exec(function (err, logs) {
        if(err) { return handleError(res, err); }
        return res.json(200, logs);
      });
    }

  } else {
    // normal user
    Log.find({user:parseInt(req.user._id)}).sort('-createdAt').exec(function (err, logs) {
      if(err) { return handleError(res, err); }
      return res.json(200, logs);
    });
  }
  
  
};

// Get a single log
exports.show = function(req, res) {
  Log.findById(req.params.id, function (err, log) {
    if(err) { return handleError(res, err); }
    if(!log) { return res.send(404); }
    return res.json(log);
  });
};

// Creates a new log in the DB.
exports.create = function(req, res) {
  var o = req.body;
  if (o.createdAt || o.createdTime) {
    var m = o.createdAt ?  moment(o.createdAt) : moment();
    if (o.createdTime) {
      var x = o.createdTime.split(':')
      m.set('hour', x[0])
      m.set('minute', x[1])
    }
    o.createdAt = m.format();
  }
  Log.create(o, function(err, log) {
    if(err) { return handleError(res, err); }
    return res.json(201, log);
  });
};

// Updates an existing log in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Log.findById(req.params.id, function (err, log) {
    if (err) { return handleError(res, err); }
    if(!log) { return res.send(404); }
    var updated = _.merge(log, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, log);
    });
  });
};

// Deletes a log from the DB.
exports.destroy = function(req, res) {
  Log.findById(req.params.id, function (err, log) {
    if(err) { return handleError(res, err); }
    if(!log) { return res.send(404); }
    log.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}