'use strict';

var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , fs          = require('fs')
  , path        = require('path')
  , _           = require('lodash')
  , ATTACH_DIR  = path.normalize(path.join(__dirname, '../../../../attachments'))
  , Log         = require('../log/log.model')
  ;

var AttachmentSchema = new Schema({
  name: String,
  log: {type: Schema.Types.ObjectId, ref: 'Log'},
  uploadKey: String,
  filename: String
});

AttachmentSchema
  .virtual('type')
  .get(function() {
    var ext = path.extname(this.filename).substr(1).toLowerCase();
    console.log(this.filename, ext);
    switch(ext) {
      case 'jpg': 
      case 'png': 
      case 'gif': 
      case 'jpeg': 
        return 'Image';
        break;
      default:
        return 'Other';

    }
  });

AttachmentSchema
  .virtual('data')
  .get(function(){
    return _.assign(this._doc, {type: this.type})
  });

AttachmentSchema
  .virtual('full_path')
  .get(function(){
    return this.log ?
      path.join(ATTACH_DIR, this.log.toString(), this.filename)
    :
      path.join(ATTACH_DIR, 'new', this.uploadKey, this.filename);

  });

AttachmentSchema.pre('remove', function(next){
  fs.unlink(this.full_path, next);
});

AttachmentSchema.post('remove', function(doc){
  Log.findById(doc.log, function(err, l){
    if (l && l.attachments) {
      var aa = []
      for (var i =0; i<l.attachments.length;i++) {
        if (l.attachments[i].toString() != doc._id.toString()) {
          aa.push(l.attachments[i])
        }
      }
      l.attachments = aa;
      l.save();
    }
  })
});

module.exports = mongoose.model('Attachment', AttachmentSchema);