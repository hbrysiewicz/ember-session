/**
  All Ember Session methods and functions are defined inside of this namespace.
*/
var ES = Ember.Namespace.create({
  VERSION: '0.0.1',

  authenticationEndpoint: '/login',

  routeAfterAuthentication: 'campaigns.index',

  authenticationRoute: 'login',

  session: null,

  setup: function(app, options) {

    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;

    // Settup the session object
    this.session = ES.Session.create();

    // Register the session
    app.register('session:current', this.session, { instantiate: false, singleton: true });

    // Inject the session into all controllers, views, routes, models, and components
    Ember.A(['model', 'controller', 'view', 'route', 'component']).forEach(function(component) {
      app.inject(component, 'session', 'session:current');
    });
  },

  socketSetup: function(accountId) {
    self = this;

    // Register account with socket server
    socket.emit('adduser', accountId);

    // Listen to websockets messages broadcast
    socket.on('messages', function (data) {
      //favicon.badge(self.session.get('messages') + 1);
      self.session.set('messages', self.session.get('messages')._data.push(data));
    });

    // Listen to websockets notifications broadcast
    socket.on('notifications', function (data) {
      //favicon.badge(self.session.get('notifications') + 1);
      self.session.set('notifications', self.session.get('notifications')._data.push(data));
    });

    // Listen to websockets purchase broadcast
    self.session.set('purchasesCount', 0);
    socket.on('purchase', function (data) {
      self.session.set('purchasesCount', self.session.get('purchasesCount') + 1);
    });

  }

});

if (Ember.libraries) {
  Ember.libraries.registerCoreLibrary('Ember Session', ES.VERSION);
}


// Session Object
ES.Session = Ember.Object.extend();


// Application Route Mixin
ES.ApplicationRouteMixin = Ember.Mixin.create(ES.AuthenticationMixin, {

  authenticate: function() {
    var self = this;

    // Reload the account into the session
    Ember.$.getJSON(window.APIURL + '/reload/' + localStorage.accountEmail).then(function(response){

      if(response.sucess){

        // Set the token in the session
        self.session.set('token', localStorage.token);

        // Set the account in the session
        self.session.set('account', response.account);

        // Set up websocket events
        ES.socketSetup(response.account.id);

      } else {
        self.transitionToRoute(ES.authenticationRoute);
      }

    });
  },

  beforeModel: function(transition) {
    var self = this;

    // Check for Token
    if (localStorage.token) {
      self.authenticate();
    }
  }
});


// Authenticated Mixin
ES.AuthenticatedRouteMixin = Ember.Mixin.create({

  beforeModel: function(transition) {
    if (!this.session.get('token')) {
      this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    var loginController = this.controllerFor('login');
    loginController.set('attemptedTransition', transition);
    this.transitionTo('login');
  }

});


// Signup Mixin
ES.SignupControllerMixin = Ember.Mixin.create({

  signup: function() {
    var self = this, data = this.getProperties('first_name', 'last_name', 'email', 'phone');

    self.set('errorMessage', null);

    Ember.$.post(window.URL + '/signup', data).then(function(response) {

      if (response.success) {

        localStorage.accountEmail = response.account.email;
        localStorage.token = response.token;

        // Set the token in the session
        self.session.set('token', response.token);

        // Set the account in the session
        self.session.set('account', response.account);

        // Set up websocket events
        ES.socketSetup();

        self.transitionToRoute('campaigns.index');

      } else {
        self.set('errorMessage', response.message);
      }

    });
  },

  resetSignup: function() {
    this.setProperties({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      errorMessage: ""
    });
  }

});


// Login Mixin
ES.LoginControllerMixin = Ember.Mixin.create(ES.AuthenticationMixin, {

  actions: {

    login: function() {
      var self = this, data = this.getProperties('username', 'password');

      self.set('errorMessage', null);

      console.log('asdfasdf');

      Ember.$.post(window.URL + ES.authenticationEndpoint, data).then(function(response) {

        if (response.success) {

          // Store the token and account in localStorage
          localStorage.accountEmail = response.account.email;
          localStorage.token = response.token;

          // Set the token in the session
          self.session.set('token', response.token);

          // Set the account in the session
          self.session.set('account', response.account);

          // Set up the sockets 
          ES.socketSetup();

          self.transitionToRoute(ES.routeAfterAuthentication);

        } else {
          self.set('errorMessage', response.message);
        }

      });

    },

    reset: function() {
      this.setProperties({
        username: "",
        password: "",
        errorMessage: ""
      })
    }

  },

  didInsertElement: function() {
    this.reset();
  }

});


// Logout Mixin
ES.LogoutMixin = Ember.Mixin.create({

});


