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

var AttachmentSchema = new Schema({
  name: {type: String, required: true},
  ext: {type: String, required: true},
  type: {type: String, required: true, default:'Other'},
});


AttachmentSchema
  .virtual('full_path')
  .get(function(){
    return this.log ?
      path.join(config.public_config.dirs.attachments, this.log.toString(), this.filename)
    :
      path.join(config.public_config.dirs.attachments, 'new', this.uploadKey, this.filename);

  });

AttachmentSchema.pre('remove', function(next){
  fs.unlink(this.full_path, next);
});

AttachmentSchema.plugin(trackable);

var LogSchema = new Schema({
  message: {type: String, required: true},
  attachments: [AttachmentSchema],
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
