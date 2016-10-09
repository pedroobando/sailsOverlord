/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcryptjs = require('bcryptjs');

module.exports = {

  'new': function (req, res) {

    //var oldDateObj = new Date();
    //var newDateObj = new Date(oldDateObj.getTime() + 60000);
    //req.session.cookie.expires = newDateObj;
    //req.session.authenticated = true;
    //console.log(req.session);
    //console.log(oldDateObj);
    //console.log(req.url);
    res.view('session/new');

  },

  create: function (req, res, next) {
    // verificacion si introduo el email o contrase~na
    //console.log('SessionController:(create) - entrando');
    if (!req.param('emailAddress') || !req.param('password')) {

      var usernamePasswordRequiredError = [{name: 'UsernamePasswordRequired', message: 'You must enter both a username and password.'}];

      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      //console.log('SessionController:(create) - sin usuario y contrase~na');
      return res.redirect('/session/new');
      //return res.redirect(req.session.origin_url);
      //return;
    }

    // Buscar el usuario
    User.findOneByEmailAddress(req.param('emailAddress'), function foundUser(err, user) {
      if (err) return next(err);

      // no fue encontrado el usuario
      if (!user) {
        var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('emailAddress') + ' not found..'}];
        req.session.flash = {
          err: noAccountError
        }
        return res.redirect('/session/new');
      }

      // verificacion si la contrase~na es la correcta
      //console.log('SessionController:(create) - a verificar la contrase~na');
      bcryptjs.compare(req.param('password'),user.encryptedPassword, function validatePassword(err, valid) {
        if (err) return next(err);

        if(!valid) {
          var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination..!'}];
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          return res.redirect('/session/new');
        }

        // Log user in
        //console.log('SessionController:(create) - contrasena correacta');
        req.session.authenticated = true;
        req.session.User = user;

        // Change status to online - on register user
        user.online = true;
        userId = user.id;
        user.save(function (err, user) {
          if (err) return next(err);

          // inform other sockets (e.g. connected sockets thas are aubscribed) that this user is now logged in
          User.publishUpdate(userId, {
            loggedIn: true,
            id: userId
          });

          // if the user is admin redirect to user list (e.g. /views/user/index.ejs)
          // This is used in conjunction with config/polices.js files
          if (req.session.User.admin) {
            return res.redirect('/user');
          }

          // Redirect a la pagina del perfil
          // res.redirect('/user/show/'+ user.id);
          if (!req.session.origin_url) {
            return res.redirect('/');
          } else {
            return res.redirect(req.session.origin_url);
          }

        });
        // if the user is admin redirect to user list (e.g. /views/user/index.ejs)
        // This is used in conjunction with config/polices.js files
        if (req.session.User.admin) {
          return res.redirect('/user');
        }

        // Redirect a la pagina del perfil
        // res.redirect('/user/show/'+ user.id);
        if (!req.session.origin_url) {
          return res.redirect('/');
        } else {
          return res.redirect(req.session.origin_url);
        }

      });

    });



  },

  destroy: function (req, res, next) {
    User.findOne(req.session.User.id, function foundUser(err, user) {

      var userId = req.session.User.id;
      // The yser is "logging out" (e.g. destroyin the session) so change the online attribute to false.
      user.online = false;
      //console.log('logout - before - actaulizacion de usuario: '+user.firstName);
      User.update(userId, user, function updateUser(err, userupd) {
        if (err) {
          //console.log(err);
          return next(err);
        }

          // inform other sockets (e.g. connected sockets thas are aubscribed) that this user is now logged in
          User.publishUpdate(userId, {
            loggedIn: false,
            id: userId
          });

        //console.log('logout - after - actaulizacion de usuario: '+userupd.firstName);
        // Wipe out the session (log out)
        req.session.destroy();
        // Redirect the browse to the sing-in screen
        res.redirect('/session/new');
      });

    });
  }

};

