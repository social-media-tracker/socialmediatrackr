var emailTemplates      = require('email-templates')
    , path              = require('path')
    , nodemailer        = require('nodemailer')
    // , smtpTransport   = require('nodemailer-smtp-transport')
    , sendmailTransport = require('nodemailer-sendmail-transport')
    , extend            = require('extend')
    , fs                = require('fs');



module.exports = function(template_dir, locals, options) {
  // email template folders
  var templatesDir = path.join(__dirname, 'email-templates');

  var default_options = require('./default_mail_options');

  var mail_options = extend(default_options.envelope_options, options);
  var smtp_options = default_options.smtp_options;
  var sendmail_options = default_options.sendmail_options;

  // set the subject.
  mail_options.subject = default_options.subjects[template_dir];

  // var transport = nodemailer.createTransport(smtpTransport(smtp_options));
  var transport = nodemailer.createTransport(sendmailTransport(sendmail_options));

  // load the templates
  emailTemplates(templatesDir, function(err, template){
    template(template_dir, locals, function(err, html, text){
      if (!err) {
        mail_options.html = html;
        if (text) mail_options.text = text;

        transport.sendMail(mail_options, function(error, info){
            if(error){
              log = 'Error: ' + error.toString() + "\n";
              var log_file = (new Date()).getTime().toString() + '.log';
              fs.writeFileSync(__dirname + '/logs/' + log_file, log);
            }
        });
      }
    });
  });
};

