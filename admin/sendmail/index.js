var emailTemplates    = require('email-templates')
    , path            = require('path')
    , nodemailer      = require('nodemailer')
    , smtpTransport   = require('nodemailer-smtp-transport')
    , extend          = require('extend');



module.exports = function(template_dir, locals, options) {
  // email template folders
  var templatesDir = path.normalize(__dirname + '/../../email-templates');

  var default_options = require('../../default_mail_options.js');


  var mail_options = extend(default_options.envelop_options, options);
  var smtp_options = default_options.smtp_options;

  // set the subject.
  mail_options.subject = default_options.subjects[template_dir];

  // load the templates
  emailTemplates(templatesDir, function(err, template){
    template(template_dir, locals, function(err, html, text){
      if (!err) {
        mail_options.html = html;
        mail_options.text = text;

        console.log(mail_options);
        var transport = nodemailer.createTransport(smtpTransport(smtp_options));
        // transport.sendMail(mail_options);
        
      }
    });
  });




};

