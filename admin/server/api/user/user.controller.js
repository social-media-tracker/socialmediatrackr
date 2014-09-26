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
  var q = {}
  if (req.query.role) {
    if (req.query.role != 'all') q.role = req.query.role;
  } else {
    q.role = {$ne:'provider'};
  }

  if (req.query.ids) {
    q._id = {$in:req.query.ids.split(',')};
  }
  
  User.find(q, '-salt -hashedPassword -password', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.providers = function(req, res) {
  User.find({role:'provider'}, '-salt -hashedPassword -password', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

exports.addToProvider = function(req, res) {
  User.findById(req.params.providerId, function(err, provider){
    if (err) return res.send(500, err);
    if (!provider) return res.send(404);
    console.log(provider);
    provider.provider_clients = provider.provider_clients || []
    provider.provider_clients.push(req.params.clientId)
    provider.save(function(){
      res.json({});
    });

  })
}

exports.removeFromProvider = function(req, res) {
  User.findById(req.params.providerId, function(err, provider){
    if (err) return res.send(500, err);
    if (!provider) return res.send(404);
    console.log(provider);
    provider.provider_clients = provider.provider_clients.map(function(v){
      return v == req.params.clientId ? null : v
    })
    provider.save(function(){
      res.json({});
    });

  })
}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  console.log('create user');
  console.log(req.body);
  var u = req.body;
  if (u.newPword) u.password = u.newPword;
  if (u.newPword_c) u.password_c = u.newPword_c;

  var newUser = new User(u);
  newUser.provider = 'local';
  newUser.role = newUser.role || 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    if (req.body.isSignup) {
      var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.json({ token: token });
    } else {
      res.json(user)
    }
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
    subscriptions: req.body.subscriptions
    provider_subscriptions: req.body.provider_subscriptions
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
  User.findById(userId, '-password -salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    if (req.user.role == 'admin') {
      res.json(user);
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


exports.changeSubscriptions = function(req, res, next) {
  var userId = req.user._id;
  var subs = req.body;

  User.findById(userId, function (err, user) {
    if (err) {
      return res.send(500);
    }
    if (!user) {
      return res.send(501);
    }

    user.subscriptions = subs.subscriptions;
    user.provider_subscriptions = subs.provider_subscriptions;

    user.save(function(err){
      if (err) return validationError(res, err);
      res.status(200).send(user.profile);
    });
  });
};


/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -password', function(err, user) { // don't ever give out the password or salt
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
