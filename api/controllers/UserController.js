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

    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        return res.redirect('/user/new');
        //return next(err);
      }
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
    User.find(function foundUsers(err, users) {
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
      res.view({
        user: user
      });
    });
  },

  update: function (req, res, next) {
    User.update(req.param('id'), req.params.all(), function updateUser(err, user) {
      if (err) {
        console.log(err);
        //return res.json(err);
        req.session.flash = {
          err: err
          }
        return res.redirect('/user/edit/'+ req.param('id'));
      }

      res.redirect('/user/show/'+ req.param('id'));
    });
  }

};

