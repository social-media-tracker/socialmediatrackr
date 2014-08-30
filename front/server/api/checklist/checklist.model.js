'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    trackable = require('mongoose-trackable');

var ChecklistSchema = new Schema({
  user: {type: Number, ref: 'User'},
  task: String,
  completedAt: Date
});
ChecklistSchema.plugin(trackable);

module.exports = mongoose.model('Checklist', ChecklistSchema);