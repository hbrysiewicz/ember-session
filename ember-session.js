var ES = Ember.Namespace.create({

  // Endpoint to send auth credentials
  authEndpoint: '/login',

  // Endpoint to send new signups
  signupEndpoint: '/signup',

  // Endpoint to reload the session data
  reloadSessionEndpoint: '/reload',

  // Login route
  loginRoute: 'login',

  // Route to go to after successful login
  routeAfterLogin: 'campaigns.index',

  // Route to go to after successful signup
  routeAfterSignup: 'welcome',

  // Session placeholder
  session: null,

  setup: function(app, options) {
    options               = options || {};
    this.routeAfterLogin   = options.routeAfterLogin || this.routeAfterLogin;
    this.loginRoute        = options.loginRoute || this.loginRoute;

    // Settup the session object
    this.session          = ES.Session.create();

    // Register the session
    app.register('session:current', this.session, { instantiate: false, singleton: true });

    // Inject the session into all controllers, views, routes, models, and components
    Ember.A(['model', 'controller', 'view', 'route', 'component']).forEach(function(component) {
      app.inject(component, 'session', 'session:current');
    });
  }

});



// Session Object
ES.Session = Ember.Object.extend();


// Application Route Mixin
ES.ApplicationRouteMixin = Ember.Mixin.create({

  authenticate: function() {
    var self = this;

    // Reload the account into the session
    Ember.$.ajax({
      url: window.URL + ES.reloadSessionEndpoint,
      type: 'GET',
      async: false
    }).then(function(response){

      if(response.success){

        // Set the account in the session
        self.session.set('account', response.account);

      } else {
        self.transitionToRoute(ES.loginRoute);
      }

    });
  },

  beforeModel: function(transition) {
    var self = this;

    // Check for Token
    if (localStorage.account) {
      self.authenticate();
    }
  }
});


// Authenticated Mixin
ES.AuthenticatedRouteMixin = Ember.Mixin.create({

  beforeModel: function(transition) {

    if (!this.session.get('account')) {

      this.redirectToLogin(transition);

    }
  },

  redirectToLogin: function(transition) {
    var loginController = this.controllerFor('login');
    loginController.set('attemptedTransition', transition);
    this.transitionTo(ES.loginRoute);
  }

});


// Signup Mixin
ES.SignupControllerMixin = Ember.Mixin.create({

  actions: {

    signup: function() {
      var self = this, data = this.getProperties('first_name', 'last_name', 'email', 'phone');

      self.set('errorMessage', null);

      Ember.$.post(window.URL + ES.signupEndpoint, data).then(function(response) {

        if (response.success) {

          localStorage.account = response.account;

          // Set the account in the session
          self.session.set('account', response.account);

          self.transitionToRoute(ES.routeAfterSignup);

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

  }

});


// Login Mixin
ES.LoginControllerMixin = Ember.Mixin.create({

  actions: {

    login: function() {
      var self = this, data = this.getProperties('username', 'password');

      self.set('errorMessage', null);

      Ember.$.post(window.URL + ES.authEndpoint, data).then(function(response) {

        if (response.success) {

          // Store the account in localStorage
          localStorage.account = response.account;

          // Set the account in the session
          self.session.set('account', response.account);

          self.transitionToRoute(ES.routeAfterLogin);

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
ES.LogoutRouteMixin = Ember.Mixin.create({

  beforeModel: function(transition) {

    delete localStorage.account;

    Ember.$.post(window.URL + ES.signupEndpoint, data).then(function(response) {

        
    });

  },

  redirectToLogin: function(transition) {
    var loginController = this.controllerFor('login');
    loginController.set('attemptedTransition', transition);
    this.transitionTo(ES.loginRoute);
  }

});

