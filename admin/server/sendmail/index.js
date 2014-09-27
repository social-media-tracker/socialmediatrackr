var emailTemplates      = require('email-templates')
    , path              = require('path')
    , nodemailer        = require('nodemailer')
    // , smtpTransport   = require('nodemailer-smtp-transport')
    , sendmailTransport = require('nodemailer-sendmail-transport')
    , util               = require('util')
    , winston            = require('winston')
    , extend            = require('extend')
    , fs                = require('fs');



module.exports = function(template_dir, locals, options) {
  winston.log('info', 'Sendmail invoked for %s', template_dir);
  // email template folders
  var templatesDir = path.join(__dirname, 'email-templates');
  winston.log('info', 'templatesDir: %s',templatesDir);

  var default_options = require('./default_mail_options');
  winston.log('info', 'default_options: %s', util.inspect(default_options, null, 3));

  var mail_options = extend(default_options.envelope_options, options);
  winston.log('info', 'mail_options: %s', util.inspect(mail_options, null, 3));
  // var smtp_options = default_options.smtp_options;
  // winston.log('info', 'smtp_options: %s', util.inspect(smtp_options, null, 3));
  var sendmail_options = default_options.sendmail_options;
  winston.log('info', 'sendmail_options: %s', util.inspect(sendmail_options, null, 3));

  // set the subject.
  if (!mail_options.subject) 
    mail_options.subject = default_options.subjects[template_dir];

  // var transport = nodemailer.createTransport(smtpTransport(smtp_options));
  var transport = nodemailer.createTransport(sendmailTransport(sendmail_options));

  // load the templates
  emailTemplates(templatesDir, function(err, template){
    if (err) {
      return winston.log('error', 'Error opening templates directory "%s": ', templatesDir, err.toString());
    }
    template(template_dir, locals, function(err, html, text){
      if (err) {
        return winston.log('error', 'Error compiling template "%s": ', template, err.toString());
      }
      mail_options.html = html;
      if (text) mail_options.text = text;

      transport.sendMail(mail_options, function(error, info){
          if(error){
            winston.log('error', 'Error Sending Email: %s', error.toString())
            // log = 'Error: ' + error.toString() + "\n";
            // var log_file = (new Date()).getTime().toString() + '.log';
            // fs.writeFileSync(__dirname + '/logs/' + log_file, log);
          }
        });
    });
  });
};

