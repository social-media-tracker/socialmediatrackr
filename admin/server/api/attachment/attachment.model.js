'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
  name: String,
  log: {type: Schema.Types.ObjectId, ref: 'Log'}
});

module.exports = mongoose.model('Attachment', AttachmentSchema);