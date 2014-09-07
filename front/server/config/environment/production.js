'use strict';
var path = require('path');

// Production specific configuration
// =================================
module.exports = function(all) {
  return {
    // Server IP
    ip:       process.env.OPENSHIFT_NODEJS_IP ||
              process.env.IP ||
              undefined,

    // Server port
    port:     process.env.OPENSHIFT_NODEJS_PORT ||
              process.env.PORT ||
              8080,

    // MongoDB connection options
    mongo: {
      uri:    'mongodb://localhost/socialmediatrackr'
    },
    public_config: {
      dirs: {
        email_templates: path.normalize(all.root + '/../email_templates'),
        attachments: path.normalize(all.root + '/../attachments'),
      },
    },
  };
};