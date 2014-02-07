// Host Server
window.URL = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

// API URL
window.APIURL = window.URL + "/api/v1"

// Socket.io Connect
var socket = io.connect(window.URL);

// Init Ember Session
Ember.Application.initializer({
  name: 'session',
  initialize: function(container, application) {
    ES.setup(application);
  }
});

// Create Application
window.App = App = Ember.Application.create();

// Setup globals to save from typing in models
var attr = Ember.attr, hasMany = Ember.hasMany, belongsTo = Ember.belongsTo;