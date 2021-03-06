/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function (req, res) {
    res.view();
  },

  create: function (req, res, next) {

    var userObj = {
      firstName: req.param('firstName'),
      title: req.param('title'),
      userName: req.param('userName'),
      emailAddress: req.param('emailAddress'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
      //online: true
    };

    User.create(userObj, function userCreated(err, user) {
      if (err) {
        //console.log(err);
        req.session.flash = {
          err: err
        }

        return res.redirect('/user/new');
        //return next(err);
      }

      // Login - Seccion actuthenticate
      req.session.authenticated = true;
      req.session.User = user;

      // Change status user online
      user.online = true;
      //console.log(user.firstName + ' (created 01)');
      //user.save(function (err, user) {
      //  if (err) return next(err);

      //  console.log(user);

      //  console.log(user.firstName + ' (created)');
        // Esto envia un json
        //res.json(user);
      //  res.redirect('/user/show/'+user.id);
        //req.session.flash = {};
      //});

      console.log(user.firstName + ' (created)');
      console.log(user.firstName + ' (created)')
      // Esto envia un json
      //res.json(user);
      res.redirect('/user/show/'+user.id);
      //req.session.flash = {};

    });

  },

  show: function (req, res, next) {

    User.findOne(req.param('id'), function foundUser(err, user) {
      if(err) {
        return next(err);
      }
      //if(!err) return next();
      res.view({
        user: user
      });
    });
  },

  index: function (req, res, next) {

    //console.log(new Date());
    //console.log(req.session.authenticated);

    // Obtiene una arreglo de todos los usuarios en una Coleccion de Usuario
    // User.find(function foundUsers(err, users) {
    User.find({sort: 'firstName'}, function foundUsers(err, users) {
      if (err) {
        return next(err);
      }
      else
      {
        res.view({
          users: users
        });
      }
    });
  },

  edit: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next('Usuario no existe..!'); //res.serverError('User no localizado..!');

      res.view({
        user: user
      });
    });
  },

  update: function (req, res, next) {

    if (req.session.User.admin) {
      var userObj = {
        firstName: req.param('firstName'),
        title: req.param('title'),
        userName: req.param('userName'),
        emailAddress: req.param('emailAddress'),
        admin: req.param('admin')
      };
    } else {
      var userObj = {
        firstName: req.param('firstName'),
        title: req.param('title'),
        userName: req.param('userName'),
        emailAddress: req.param('emailAddress'),
      };
    }

    User.update(req.param('id'), userObj, function updateUser(err, user) {

      if (err) {
        console.log(err);
        //return res.json(err);
        req.session.flash = {
          err: err
          }
        return res.redirect('/user/edit/'+ req.param('id'));
      }

      console.log(user.firstName + ' (updated)');
      // Actualizacion del nivel de usuario
      //if (req.param('id') === req.session.User.id) {
      //  req.session.User = user.admin; // true;
        //req.session.User = user;
      //}


      return res.redirect('/user/show/'+ req.param('id')); //res.redirect('/user'); //
    });
  },

  destroy: function (req, res, next) {

    User.findOne(req.param('id'),function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('Usuario no existe..!');

      User.destroy(req.param('id'), function userDestroy(err) {
        if (err) return next (err);
      });
      console.log(user.firstName + ' (destroy)');
      //console.log(user.firstName + ' (created)')
      res.redirect('/user');
    });
  },


  subscribe: function (req, res) {

    if (!req.isSocket) {
      return res.badRequest('Only a client socket can subscribe to Louies.  You, sir or madame, appear to be an HTTP request.');
    }

    User.find(function foundUsers(err, users) {
      if (err) return next(err);

      // subscribe this socket to User model classroom.
      //User.subscribe(req.socket);

      // subscribe this socket to the user instance rooms.
      //User.subscribe(req.socket, users);
      User.subscribe(req, _.pluck(users,'id'));

      return res.ok(); //res.send(200);
    });
  }

};
