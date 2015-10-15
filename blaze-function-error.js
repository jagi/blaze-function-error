Users = new Mongo.Collection('users', {
  transform: function(doc) {
    doc.method = function(param) {
      return param + ' ' + this.firstName + ' ' + this.lastName;
    };
    return doc;
  }
});

if (Meteor.isServer) {
  Users.find().forEach(function(user) {
    Users.remove(user._id);
  });

  Users.insert({
    firstName: 'John',
    lastName: 'Smith'
  });

  Meteor.publish('users', function() {
    return Users.find();
  });
}

if (Meteor.isClient) {
  Template.User.helpers({
    user: function() {
      return Users.findOne();
    },

    error: function() {
      return window.location.pathname === '/error';
    }
  });

  Template.User.events({
    'click #refresh': function() {
      window.location = '/error';
    }
  });

  Template.User.onCreated(function() {
    var instance = this;

    var subscription = instance.subscribe('users');
  });
}
