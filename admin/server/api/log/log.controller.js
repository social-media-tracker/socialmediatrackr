'use strict';

var _ = require('lodash');
var Log = require('./log.model');
var moment = require('moment');
var paginate = require('node-paginate-anything');

// Get list of logs
exports.index = function(req, res) {

  var query, total_items, count_query;

  // admin user
  if (req.user.role === 'admin') {
    var q = {}

    if (req.query.user && req.query.user !== "-1") {
      q.user = req.query.user;
    }

    if (q === {}) {
      count_query = Log.count();
      query = Log.find();
    } else {
      count_query = Log.count(q);
      query = Log.find(q);
    }
    count_query.exec(function(err, total_items){
      if (err) { return handleError(res, err); }
      if (!total_items) { return res.json(500, {error: 'No items to display.'})}
      console.log(total_items);

      var queryParameters = paginate(req, res, total_items, 100);
      console.log(queryParameters);

      if (!queryParameters) { return res.json(500, {
        error: 'Error Creating Query Parameters',
        total_items: total_items
      }); }

      query.sort('-createdAt').populate('user')
        .limit(queryParameters.limit)
        .skip(queryParameters.skip)
        .exec(function (err, logs) {
          if(err) { return handleError(res, err); }
          return res.send(200, logs);
        });
    })

  } else {
    // normal user
    count_query = Log.count({user:parseInt(req.user._id)});
    query = Log.find({user:parseInt(req.user._id)});
    count_query.exec(function(err, total_items){
      if (err) { return handleError(res, err); }
      if (!total_items) { return res.json(200, {error: 'No items to display.'})}

      var queryParameters = paginate(req, res, total_items, 100);
      query.sort('-createdAt')
        .limit(queryParameters.limit)
        .skip(queryParameters.skip)
        .exec(function (err, logs) {
          if(err) { return handleError(res, err); }
          return res.send(200, logs);
        });

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