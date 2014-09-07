'use strict';

var mongoose          = require('mongoose')
    , Schema          = mongoose.Schema
    , trackable       = require('mongoose-trackable')
    , User            = require('../user/user.model')
    , Attachment      = require('../attachment/attachment.model')
    , sendmail        = require('../../sendmail')
    , path            = require('path')
    , fs              = require('fs')
    , ObjectId        = mongoose.Schema.Types.ObjectId
    , ATTACH_DIR      = path.normalize(path.join(__dirname, '../../../../attachments'))
    , winston         = require('winston')
    , config          = require('../../config/environment');


var LogSchema = new Schema({
  message: String,
  user: {type: Number, ref: 'User'},
  checklist: {type: Schema.Types.ObjectId, ref: 'Checklist', required: false},
  uploadKey: String,
  attachments:[{type: ObjectId, ref: 'Attachment'}]
});


LogSchema.plugin(trackable);

LogSchema
  .virtual('attachments_dir')
  .get(function(){
    return path.join(ATTACH_DIR, this._id.toString());
  });

// find any attachments uploaded before the doc was saved and associate them to the log.
LogSchema.post('save', function (doc) {

  // check for attachments that might exist for this log
  if (doc.uploadKey) {
    Attachment.find({uploadKey:doc.uploadKey,log:null}, function(err, attachments) {
      if (attachments && attachments.length) {
        console.log(attachments.length + ' attachments found');

        for (var i in attachments) {
          var a = attachments[i];
          var attach_dir = config.public_config.dirs.attachments;//path.normalize(path.join(__dirname, '../../../../attachments'))
          var move_from = path.join(attach_dir, 'new', a.uploadKey, a.filename);
          var move_to_folder = path.join(attach_dir, doc._id.toString());
          var move_to = path.join(move_to_folder, a.filename);
          if (!fs.existsSync(move_to_folder)){
            fs.mkdirSync(move_to_folder);
          }
          fs.renameSync(move_from, move_to);
          doc.attachments.push(a._id);
        }

        // update the attachment records in the db
        Attachment.update({uploadKey:doc.uploadKey}, {$set:{log:doc._id}}, function(err){
        doc.save();
          // not much we can do about errors, need to enable a logger to log them.
        })
      }
    })

  }
});

LogSchema.pre('save', function(next){
  this.wasNew = this.isNew;
  next();
});


// email user when a new event is created
LogSchema.post('save', function (doc) {
  winston.log('was-new', this.wasNew)
  if (this.wasNew) {
    // create our locals for the template
    var locals = {
      log: doc
    };
    // need to add user to locals
    User.findById(doc.user, function(err, user) {
      // TODO: Find a way to deal with errors like this... a log file would be nice!
      if (err) { console.log('Error finding user: ' + err.toString()); }
      if (!user) {console.log('Error finding user with id ' + doc.user); }
      if (user.subscriptions && user.subscriptions.activityNotification) {
        locals.user = user;
        var sendmail_options = {
          to: user.name + ' <' + user.email + '>',
        }
        sendmail('activity', locals, sendmail_options);
      }
    });
  }
});

// delete any attachments when a log gets deleted
LogSchema.pre('remove', function (next) {
  var log = this;
  Attachment.find({log:this._id}, function(err, attachments){
    if (err) return next(err);
    if (!attachments.length) return next();

    console.log('Found %d attachments to delete', attachments.length);
    var count = 0;
    var removeListener = function(err) {
      console.log('attachment #%d has been removed.', count);
      if (err) return next(err);
      if (++count >= attachments.length) {
        console.log('All attachments deleted, calling next()');
        // remove our attachment folder
        fs.rmdir(log.attachments_dir, next);
        
      } else {
        console.log('Moving on to next attachment...');
        nextAttachment();
      }

    }

    var nextAttachment = function() {
      console.log('Removing attachment #' + count);
      attachments[count].remove(removeListener);
    }

    nextAttachment();

  });

});

module.exports = mongoose.model('Log', LogSchema);

