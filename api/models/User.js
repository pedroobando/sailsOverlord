/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {


  // Identity is a unique name for this model and must be in lower case
  identity: 'User',

  schema: true,

  // Connection
  // A named connection which will be used to read/write to the datastore
  // connection: 'local-postgresql',

  // TableName
  // Use a custom database table/collection name rather than inferring it from the name of the model.
  // tableName: 'Users',

  // Migrate
  // Sets the schema to automatically alter the schema, drop the schema or make no changes (safe).
  //migrate: 'drop',

  // Attributes are basic pieces of information about a model
  attributes: {

    firstName: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string'
    },

    userName: {
      type: 'string',
      unique: true,
      required: true
    },

    birthDate: {
      type: 'date'
      //required: true
    },

    emailAddress: {
      type: 'email',
      required: true,
      unique: true
    },

    encryptedPassword: {
      type: 'string' //,
      //required: true
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  },

  beforeCreate: function(values, next) {

    if (!values.password || values.password != values.confirmation) {
      //console.log('error en password')
      return next({err: ["Verifique el password o contraseña."]});
    }
    //console.log('Verificacion password - (ok)')
    //console.log('El valor del password: ' + values.password);

    var bcrypt = require('bcryptjs');
    bcrypt.hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
    if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      values.online = true;
      next();
    });
    //console.log('bcryptjs aplicado - (ok)');

    //var bcryptjs = require('bcryptjs');
    //bcryptjs.hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
    //  values.encryptedPassword = encryptedPassword;
    //  values.password=null;
    //  values.confirmation=null;
    //  next();
    //});
  }
};
