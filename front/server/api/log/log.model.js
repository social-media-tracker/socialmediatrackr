'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    trackable = require('mongoose-trackable');

var LogSchema = new Schema({
  message: String,
  user: {type: Number, ref: 'User'},
  checklist: {type: Schema.Types.ObjectId, ref: 'Checklist', required: false}
});

LogSchema.plugin(trackable);

module.exports = mongoose.model('Log', LogSchema);
