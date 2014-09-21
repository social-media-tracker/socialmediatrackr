'use strict';

var _ = require('lodash');
var Task = require('./task.model');
var Template = require('../template/template.model');
var Cat = require('../category/category.model');
var async = require('async');

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
      res.json(200, task.data)
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
}
function handleError(res, err) {
  return res.send(500, err);
}