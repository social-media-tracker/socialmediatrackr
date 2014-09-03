'use strict';

var mongoose          = require('mongoose')
    , Schema          = mongoose.Schema
    , trackable       = require('mongoose-trackable')
    , User            = require('../user/user.model')
    , Attachment      = require('../attachment/attachment.model')
    , sendmail        = require('../../sendmail')
    , path            = require('path')
    , fs              = require('fs')
    ;


var LogSchema = new Schema({
  message: String,
  user: {type: Number, ref: 'User'},
  checklist: {type: Schema.Types.ObjectId, ref: 'Checklist', required: false},
  uploadKey: String,
});


LogSchema.plugin(trackable);

LogSchema.post('save', function (doc) {

  // check for attachments that might exist for this log
  if (doc.uploadKey) {
    Attachment.find({uploadKey:doc.uploadKey}, function(err, attachments) {
      if (attachments) {
        for (var i in attachments) {
          var a = attachments[i];
          var attach_dir = path.normalize(path.join(__dirname, '../../../../attachments'))
          var move_from = path.join(attach_dir, 'new', a.uploadKey, a.filename);
          var move_to_folder = path.join(attach_dir, doc._id.toString());
          var move_to = path.join(move_to_folder, a.filename);
          if (!fs.existsSync(move_to_folder)){
            fs.mkdirSync(move_to_folder);
          }
          fs.renameSync(move_from, move_to);
        }

        // update the attachment records in the db
        Attachment.update({uploadKey:doc.uploadKey}, {$set:{log:doc._id}}, function(err){
          // not much we can do about errors, need to enable a logger to log them.
        })
      }
    })

  }
});

// email user when a new event is created
//* EMAIL IS BROKEN NOW....
LogSchema.post('save', function (doc) {
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
});
//*/


module.exports = mongoose.model('Log', LogSchema);

