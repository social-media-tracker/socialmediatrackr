'use strict';

var mongoose          = require('mongoose')
    , Schema          = mongoose.Schema
    , trackable       = require('mongoose-trackable')
    , User            = require('../user/user.model')
    , sendmail        = require('../../../sendmail')
    ;


var LogSchema = new Schema({
  message: String,
  user: {type: Number, ref: 'User'},
  checklist: {type: Schema.Types.ObjectId, ref: 'Checklist', required: false}

});


LogSchema.plugin(trackable);

// email user when a new event is created
LogSchema.post('save', function (doc) {
  // create our locals for the template
  var locals = {
    log: doc
  };
  // need to add user to locals
  User.findById(doc.user, function(err, user) {
    if (!err) {
      locals.user = user;
      var sendmail_options = {
        to: user.name + ' <' + user.email + '>',
      }
      sendmail('activity', locals, sendmail_options);
    }
  });
console.log('%s has been saved', doc);
});


module.exports = mongoose.model('Log', LogSchema);

