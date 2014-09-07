'use strict';

var mongoose    = require('mongoose')
  , ObjectId    = mongoose.Schema.Types.ObjectId
  , _           = require('lodash')
  , Log         = require('./log.model')
  , User        = require('./log.model')
  , moment      = require('moment')
  , paginate    = require('node-paginate-anything')
  , fs          = require('fs')
  , path        = require('path')
  , Attachment  = require('../attachment/attachment.model')
  , S           = require('string')
  , winston      = require('winston')


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
      if (err) return handlError(res, err, 'Unable to create attachment record in the db');
      winston.log('info','File Upload %s%s complete.', upload_to, filename);
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
      

    } else if (req.query.uploadKey) {
      // new items
      var key = req.query.uploadKey;

      // first let's check if an item w/ the upload key exists
      Log.findOne({uploadKey:key}, function(err, doc){
        if (doc) {
          attachObj.log = doc._id;
          upload_to = path.join(upload_to, doc._id.toString());
        } else {
          attachObj.uploadKey = key;
          upload_to = path.join(upload_to, 'new', key);

        }
        uploadAttachment(file, upload_to, filename, attachObj, res, doc);
      })
    } else {
      return res.json(200, {error: 'Missing log_id and uploadKey, one is required.'});
    }



  });
};

// Get list of logs
exports.index = function(req, res) {
  winston.log('info','GET /api/logs');

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

      var queryParameters = paginate(req, res, total_items, 100);

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
      if (!total_items) { return res.json(200, [])}

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

exports.uploadKey = function(req, res) {
  res.json(200, {key:(new Date).getTime()});
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

  User.findById(ObjectId('100'), function(err, u) {

    console.log('user 100', err, u);
  });

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

function handleError(res, err, additional_detail) {
  if (additional_detail) {
    winston.log('error', additional_detail + ' :: ' + err.toString());
  } else {
    winston.log('error', err.toString());
  }
  return res.send(500, err);
}