var sendmail  = require('./index')
  , User      = require('../api/user/user.model')
  , winston   = require('winston')
  , util      = require('util')
;

/**
 * Sends notification emails to admins that want it.
 * @param notificationSetting (string indicating which of admin_subscriptions should be used.)
 * @param template_dir (see sendmail/index.js)
 * @param locals (see sendmail/index.js)
 * @param options (see sendmail/index.js)
 * @param cb (optional call back to call once all emails are sent.)
**/

module.exports = function(notificationSetting, template_dir, locals, options, cb) {
  var q = {role:'admin'}
  q['admin_subscriptions.' + notificationSetting] = true;

  winston.log('info', 'Querying administrators: %s', util.inspect(q,null,9));
  User.find(q).exec(function(err, users) {
    if (err) {
      winston.log('info', 'Error querying users: %s\nQuery: %s', err.toString(), util.inspect(q,null,9))
    } else {
      if (!users || !users.length) {
        winston.log('info', 'No administrators found matching query: %s', util.inspect(q,null,9))
      } else {
        users.map(function(u){
          winston.log('info', 'Sending %s email to %s (%s)', notificationSetting, u.name, u.email);
          options.to =  u.name + ' <' + u.email + '>'
          locals.to_user = u;
          sendmail(template_dir, locals, options);
        });
      }
    }
    if (cb) cb()
  }); 
};

