'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , trackable = require('mongoose-trackable')
  , autoinc = require('mongoose-auto-increment')
;

var CategorySchema = new Schema({
  type: {
    type: String, 
    required: true, 
    enum: {
      values: ['activity','task'],
      message: 'Template type must be one of "activity" or "task".'
    }
  },
  name: String
});

CategorySchema.plugin(trackable);
CategorySchema.plugin(autoinc.plugin, {model:'Category', startAt:10});

module.exports = mongoose.model('Category', CategorySchema);