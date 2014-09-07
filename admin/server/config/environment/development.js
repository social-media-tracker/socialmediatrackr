'use strict';
var path = require('path');

// Development specific configuration
// ==================================
module.exports = function(all) {
  return {
    // MongoDB connection options
    mongo: {
      uri: 'mongodb://localhost/socialmediatrackr-dev'
    },
    port: 9001,

    seedDB: false,
    public_config: {
      dirs: {
        email_templates: path.normalize(all.root + '/../email_templates'),
        attachments: path.normalize(all.root + '/../attachments'),
      },
    },
  };
};

