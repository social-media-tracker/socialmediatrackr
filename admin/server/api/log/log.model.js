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

LogSchema
  .virtual('attachments_dir')
  .get(function(){
    return path.join(ATTACH_DIR, this._id.toString());
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
  var Attachment = require('../attachment/attachment.model')
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

