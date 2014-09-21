'use strict';

var mongoose = require('mongoose')
  ,  Schema = mongoose.Schema
  ,  trackable = require('mongoose-trackable')
  ,  autoinc = require('mongoose-auto-increment')
  , _           = require('lodash')
;

var CommentSchema = new Schema({
  message: {type: String, required: true},
  user: {type: Number, ref: 'User'}
});

CommentSchema.plugin(trackable);

var LogSchema = new Schema({
  message: {type: String, required: true},
  comments: [CommentSchema]
});

LogSchema.plugin(trackable);

var TaskSchema = new Schema({
  cat: {type: Number, ref: 'Category'},
  message: {type: String, required: true},
  provider: {type: Number, ref: 'User'},
  client: {type: Number, ref: 'User'},
  completedAt: Date,
  logs: [LogSchema]
});

TaskSchema.virtual('isComplete')
.get(function(){
  return this.completedAt ? true : false
})
.set(function(v) {
  this.completedAt = new Date();
});

TaskSchema
  .virtual('data')
  .get(function() {
    return _.assign(this._doc, {isCompleted: this.isComplete})
  });


TaskSchema.plugin(trackable);
TaskSchema.plugin(autoinc.plugin, {
  model: 'Task',
  startAt: 1000
});

module.exports = mongoose.model('Task', TaskSchema);
