/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Waterline = require('waterline');

var modUser = Waterline.Collection.extend({

  // Identity is a unique name for this model and must be in lower case
  identity: 'userOld',

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

    lastName: {
      type: 'string'
      //required: true
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
      type: 'string',
      required: true
    },

    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    },

    year: function () {
      if (!this.birthDate) {
        return 0;
      }
      return 2000 - this.birthDate;
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.emailAddress;
      return obj;
    }



  }
});

module.exports = modUser;
