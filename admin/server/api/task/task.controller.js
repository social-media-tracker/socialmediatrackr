'use strict';

var _         = require('lodash')
  , Task      = require('./task.model')
  , Template  = require('../template/template.model')
  , Cat       = require('../category/category.model')
  , async     = require('async')
  , path      = require('path')
  , mime      = require('mime')
  , fs        = require('fs')
  , S           = require('string')
  , winston   = require('winston')
  , config    = require('../../config/environment')
  , sendmail  = require('../../sendmail')
;

// Get list of tasks
exports.index = function(req, res) {
  var q = {}

  if (req.user.role == 'provider') {
    q.provider = req.user._id;
  } else {
    if (req.query.provider) {
      q.provider = req.query.provider;
    }
  }

  if (req.query.cat) {
    q.cat = req.query.cat;
  }

  Task.find(q).populate(['provider','cat','client']).exec(function (err, tasks) {
    if(err) { return handleError(res, err); }
    return res.json(200, tasks.map(function(t){return t.data}));
  });
};

// Get a single task
exports.show = function(req, res) {
  Task.findById(req.params.id).populate(['cat','provider','client']).sort('-createdAt').exec(function (err, task) {
    if(err) return handleError(res, err);
    if(!task) return res.send(404);
    return res.json(200, task.data);
  });
};

exports.completed = function(req, res) {
  Task.findByIdAndUpdate(req.params.id, {completedAt:new Date()}, function(err, task){
    if(err) return handleError(res, err);
    if(!task) return res.send(404);
    res.json(200, task.data);
  });
}

exports.uncompleted = function(req, res) {
  Task.findByIdAndUpdate(req.params.id, {completedAt:null}, function(err, task){
    if(err) return handleError(res, err);
    if(!task) return res.send(404);
    res.json(200, task.data);
  });
}

// Creates a new task in the DB.
exports.create = function(req, res) {

  var saveTemplate = false;
  if (req.body.saveAsTemplate) {
    saveTemplate = true
    delete req.body.saveAsTemplate;
  }

  var newTask = false

  var sync = []

  if (isNaN(parseInt(req.body.cat))) {
    var newCat = req.body.cat;
    delete(req.body.cat);
    sync.push(function(next){
      Cat.create({
        name: newCat,
        type: 'task'
      }, function(err, cat){
        if (err) next(err);
        req.body.cat = cat._id
        next(null, cat)
      }); // Cat.create
    }); // sync.push 
  }

  sync.push(function(next){
    Task.create(req.body, function(err, task) {
      if(err) return handleError(res, err);
      newTask = task;
      if (saveTemplate) {
        req.body.type = 'task';
        delete(req.body.user);
        Template.create(req.body, function(err, template){
          if(err) return handleError(res, err);
          next(null, task);
        }); // template.create
      } else {
          next(null, task);
      }
    }); //Task.create()
  }); //sync.push 

  async.series(sync, function(err, results) {
    if (err) return handleError(err);
    Task.findById(newTask._id).populate(['cat','provider','client']).exec(function(err, task){
      if (err) return handleError(err);

      // email the provider if they've subscribed to newTaskNotification
      if (task.provider.provider_subscriptions.newTaskNotification) {

        winston.log('info', 'Sending reply email to %s (%s)', log.user.name, log.user.email);

        var sendmail_locals = {
          task: task,
          user: task.provider
        }
        var sendmail_options = {
          to: task.provider.name + ' <' + task.provider.email + '>',
        }
        
        sendmail('new-task', sendmail_locals, sendmail_options);
        res.json(200, task.data)

      } else {
        res.json(200, task.data)  
      }
      
    });
    
  });
}; 

// Updates an existing task in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Task.findById(req.params.id, function (err, task) {
    if (err) return handleError(res, err);
    if(!task) { return res.send(404); }
    var updated = _.merge(task, req.body);
    updated.save(function (err) {
      if (err) return handleError(res, err);
      return res.json(200, task.data);
    });
  });
};

// Deletes a task from the DB.
exports.destroy = function(req, res) {
  Task.findById(req.params.id, function (err, task) {
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    task.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Task Work Log
exports.postLog = function(req, res)  {
  Task.findById(req.params.id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    task.logs.push(_.assign(req.body, {user:req.user._id}))
    task.save(function(err){
      if(err) { return handleError(res, err); }
      res.json(200, task);
    });
  });
};

exports.postLogComment = function(req, res) {
  Task.findById(req.params.id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    for (var i = 0; i<task.logs.length; i++) {
      if (task.logs[i]._id == req.params.log_id) {
        task.logs[i].comments.push(_.assign(req.body, {user:req.user._id}))
        task.save(function(err){
          if(err) { return handleError(res, err); }

          for (var j = 0; j<task.logs.length; j++) {
            if (task.logs[j]._id == req.params.log_id) {
              return res.json(200, task.logs[j].comments.pop());
            }
          }

        });
      }
    }
  });
};

exports.deleteAttachment = function(req, res) {
  console.log('loading attachment %s %s %s', req.params.id, req.params.log_id, req.params.attach_id)
  var task_id = req.params.id;
  Task.findById(task_id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    var log_id = req.params.log_id;
    var attach_id = req.params.attach_id;
    var logIndex = _.findIndex(task.logs, function(l) {return l._id == log_id});
    var attachIndex = _.findIndex(task.logs[logIndex].attachments, function(a) {return a._id == attach_id});
    var attach = task.logs[logIndex].attachments[attachIndex];
    var file_path = path.join(res.locals.cfg.dirs.attachments, 'tasks', task_id, log_id, attach_id + '.' + attach.ext);
    fs.unlink(file_path);
    task.logs[logIndex].attachments.splice(attachIndex, 1)
    task.save(function(err){
      if(err) { return handleError(res, err); }
      res.status(200).send({});
    });

  });
};

exports.passthruLogAttachment = function(req, res) {
  console.log('loading attachment %s %s %s', req.params.id, req.params.log_id, req.params.attach_id)
  var task_id = req.params.id;
  Task.findById(task_id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }

    var log_id = req.params.log_id;
    var attach_id = req.params.attach_id;

    var logIndex = _.findIndex(task.logs, function(l) {return l._id == log_id});
    var attachIndex = _.findIndex(task.logs[logIndex].attachments, function(a) {return a._id == attach_id});
    var attach = task.logs[logIndex].attachments[attachIndex];

    var file_path = path.join(res.locals.cfg.dirs.attachments, 'tasks', task_id, log_id, attach_id + '.' + attach.ext);
    console.log(file_path);
    res.sendfile(file_path);


  });
};
exports.downloadLogAttachment = function(req, res) {
  console.log('loading attachment %s %s %s', req.params.id, req.params.log_id, req.params.attach_id)
  var task_id = req.params.id;
  Task.findById(task_id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }

    var log_id = req.params.log_id;
    var attach_id = req.params.attach_id;

    var logIndex = _.findIndex(task.logs, function(l) {return l._id == log_id});
    var attachIndex = _.findIndex(task.logs[logIndex].attachments, function(a) {return a._id == attach_id});
    var attach = task.logs[logIndex].attachments[attachIndex];

    var file_path = path.join(res.locals.cfg.dirs.attachments, 'tasks', task_id, log_id, attach_id + '.' + attach.ext);
    console.log(file_path);

    var mimetype = mime.lookup(file_path);
    res.setHeader('Content-disposition', 'attachment; filename=' + attach.name + '.' + attach.ext);
    res.setHeader('Content-type', mimetype);
    fs.createReadStream(file_path).pipe(res);
  });
};

exports.uploadLogAttachment = function(req, res) {
  Task.findById(req.params.id, function(err, task){
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      var ext = path.extname(filename);
      var name = filename.replace(new RegExp(ext), '');
      ext = ext.toLowerCase().substr(1);
      var upload_to = path.join(res.locals.cfg.dirs.attachments, 'tasks');
      if (!fs.existsSync(upload_to)) fs.mkdirSync(upload_to);
      upload_to = path.join(upload_to, req.params.id.toString()); // folder for task's attachments
      if (!fs.existsSync(upload_to)) fs.mkdirSync(upload_to);
      var attachObj = {
        name: name,
        ext: ext
      };

      switch(ext) {
        case 'jpg': 
        case 'png': 
        case 'gif': 
        case 'jpeg': 
          attachObj.type = 'Image';
          break;
        default:
          attachObj.type = 'Other';
      }


      var numLogs = task.logs.length;
      var logIndex = -1;
      for (var i = 0; i < numLogs; i++) {
        if (task.logs[i]._id == req.params.log_id) {
          logIndex = i;
          task.logs[i].attachments.push(attachObj);
          break;
        }
      }


      if (logIndex === -1) return handleError(res, new Error('Unable to locate work log :' + req.params.log_id))
      upload_to = path.join(upload_to, task.logs[logIndex]._id.toString());
      if (!fs.existsSync(upload_to)) fs.mkdirSync(upload_to);

      task.save(function(err) {
        if(err) { return handleError(res, err); }
        attachObj = task.logs[logIndex].attachments[task.logs[logIndex].attachments.length-1];
        var filename = attachObj._id + '.' + attachObj.ext;

        var fstream = fs.createWriteStream(path.join(upload_to, filename));
        file.pipe(fstream);
        fstream.on('close', function () {
          res.status(200).send(attachObj);
        });

      });

    });

  });

};

function handleError(res, err) {
  return res.send(500, err);
}