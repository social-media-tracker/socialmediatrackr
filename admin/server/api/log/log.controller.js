'use strict';

var mongoose    = require('mongoose');
var ObjectId    = mongoose.Schema.Types.ObjectId;
var _           = require('lodash');
var Log         = require('./log.model');
var User        = require('./log.model');
var moment      = require('moment');
var fs          = require('fs');
var path        = require('path');
var Attachment  = require('../attachment/attachment.model');
var S           = require('string');
var winston     = require('winston');
var config      = require('../../config/environment');
var sendmail    = require('../../sendmail');

function handleError(res, err, additional_detail) {
  if (additional_detail) {
    winston.log('error', additional_detail + ' :: ' + err.toString());
  } else {
    winston.log('error', err.toString());
  }
  return res.send(500, err);
}

function uploadAttachment(file, upload_to, filename, attachObj, res, log){
  winston.log('info','Uploading %s to %s', filename, upload_to);

  if (!fs.existsSync(upload_to)) {
    winston.log('info', 'Creating %s', upload_to)
    fs.mkdirSync(upload_to);
  }

  var fstream = fs.createWriteStream(path.join(upload_to, filename));
  file.pipe(fstream);
  fstream.on('close', function () {

    // file has been written, lets create the database record for it.
    Attachment.create(attachObj, function(err, doc){
      if (err) return handleError(res, err, 'Unable to create attachment record in the db');
      winston.log('info','File Upload %s/%s complete.', upload_to, filename);
      if (log) {
        log.attachments = log.attachments || [];
        log.attachments.push(doc._id)
        log.save(function(err){
          if (err) {
            return handleError(res, err, 'Unable to link attachment to activity in the db');
          }
          res.json(200, doc);
        });

      } else {
        res.json(200, doc);
      }

    });
  });
}

exports.upload = function(req, res) {
  
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var ext = path.extname(filename);

    var upload_to = res.locals.cfg.dirs.attachments;
    var uploadType, uploadId;

    var attachObj = {
      name: S(path.basename(filename, ext)).humanize().s,
      filename: filename,
    };

    // figure out if we're uploading to a new or existing item
    if (req.params.id) {
      // existing activity item
      Log.findById(req.params.id, function(err, doc) {
        if (err) return handleError(res, err, 'Unable to locate Activity Log #' + req.params.id)
        upload_to = path.join(upload_to, req.params.id);
        attachObj.log = req.params.id;
        uploadAttachment(file, upload_to, filename, attachObj, res, doc);
      })
    } else {
      return handleError(res, new Error('Missing Activity ID for attachment.'));
    }
  });
};

// Get list of logs
exports.index = function(req, res) {
  winston.log('info','GET /api/logs');

  var limit = parseInt(req.query.limit) || 10;
  var page = parseInt(req.query.page) || 1;

  var skip = (page - 1) * limit;

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
      if (!total_items) { return res.json(200, [])}

      query.sort('-createdAt')
        .populate('user')
        .populate('replies.user')
        .limit(limit)
        .skip(skip)
        .exec(function (err, logs) {
          if(err) { return handleError(res, err); }
          var o = {
            total: total_items,
            data: logs,
          };
          return res.send(200, o);
        });
    })

  } else {
    // normal user
    count_query = Log.count({user:parseInt(req.user._id)});
    query = Log.find({user:parseInt(req.user._id)});
    count_query.exec(function(err, total_items){
      if (err) { return handleError(res, err); }
      if (!total_items) { return res.json(200, [])}

      query.sort('-createdAt')
        .limit(limit)
        .skip(skip)
        .exec(function (err, logs) {
          if(err) { return handleError(res, err); }
          var o = {
            total: total_items,
            data: logs,
          };
          return res.send(200, o);
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

  try {
    Log.create(o, function(err, log) {
      if(err) { return handleError(res, err); }
      Log.findById(log._id).populate('user').exec(function(err, l){
        if(err) { return handleError(res, err); }
        return res.json(201, l);
      });
    });
  } catch(e) {
    res.json(200,{error:e.toString()})
  }

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

exports.reply = function(req, res) {
  Log.findById(req.params.id).populate('user').exec(function (err, log) {
    if(err) { return handleError(res, err); }
    if(!log) { return res.send(404); }
    log.replies = log.replies || [];
    log.replies.push(req.body)
    log.save(function(err) {
      if(err) { return handleError(res, err); }

      // try to send an email about it if the user wants it.
      if (log.user.subscriptions && log.user.subscriptions.replyNotifications) {
        winston.log('info', 'Sending reply email to %s (%s)', log.user.name, log.user.email);

        var sendmail_locals = {
          log: log,
          user: log.user,
          reply: req.body
        }
        var sendmail_options = {
          to: log.user.name + ' <' + log.user.email + '>',
        }
        
        sendmail('reply', sendmail_locals, sendmail_options);
        Log.findById(req.params.id)
          .populate('user')
          .populate('replies.user')
          .exec(function(err, log){
            if(err) { return handleError(res, err); }
            if(!log) { return res.send(404); }

            res.send(log);
          });

      } else {
        Log.findById(req.params.id)
          .populate('user')
          .populate('replies.user')
          .exec(function(err, log){
            if(err) { return handleError(res, err); }
            if(!log) { return res.send(404); }

            res.send(log);
          });
      }
      
    });
  });
};
