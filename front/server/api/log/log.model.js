'use strict';

var mongoose      = require('mongoose')
  , Schema        = mongoose.Schema
  , ObjectId      = mongoose.Schema.Types.ObjectId
  , trackable     = require('mongoose-trackable')
;


var ReplySchema = new Schema({
  message: {type: String, required: true},
  user: {type: Number, ref: 'User'}
});

ReplySchema.plugin(trackable);

var LogSchema = new Schema({
  message: String,
  user: {type: Number, ref: 'User'},
  checklist: {type: Schema.Types.ObjectId, ref: 'Checklist', required: false},
  attachments:[{type: ObjectId, ref: 'Attachment'}],
  replies: [ReplySchema],

});

LogSchema.plugin(trackable);

module.exports = mongoose.model('Log', LogSchema);
