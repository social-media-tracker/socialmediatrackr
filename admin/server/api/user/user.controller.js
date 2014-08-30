'use strict';

var User = require('./user.model');
var Log = require('../log/log.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Update current user
 */
exports.update = function (req, res, next) {

  if (req.user.role != 'admin') {
    res.send(501);
  }

  var userId = req.params.id;
  var update = {
    name: req.body.name,
    email: req.body.email,
  };
  
  User.findByIdAndUpdate(userId, update, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);

    if (req.body.newPword && req.body.newPword_c && (req.body.newPword == req.body.newPword_c))  {
      user.password = req.body.newPword;
      user.save(function(err){
        if (err) return res.json({error:'Error saving new password: ' + err.toString()});
        res.json({success:1});
      });
    } else {
      res.json({success:1});
    }
  });
}

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    if (req.user.role == 'admin') {
      res.json({
          _id: user._id,
          name: user.name,
          email: user.email
        });
    } else {
      res.json(user.profile)
    }

  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};