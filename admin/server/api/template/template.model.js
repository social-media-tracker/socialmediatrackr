'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    trackable = require('mongoose-trackable');

var TemplateSchema = new Schema({
  type: {
    type: String, 
    required: true, 
    enum: {
      values: ['activity','task'],
      message: 'Template type must be one of "activity" or "task".'
    }
  },
  cat: {
    type: Number,
    ref: 'Category',
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

TemplateSchema.plugin(trackable);
module.exports = mongoose.model('Template', TemplateSchema);