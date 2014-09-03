/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    _id: 100,
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    _id: 101,
    name: 'Test User',
    email: 'thomporter@gmail.com',
    password: 'test',
    subscriptions: { activityNotification: true }
  }, function() {
      console.log('finished populating users');
    }
  );
});