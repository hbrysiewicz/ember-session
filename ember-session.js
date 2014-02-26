(function() {

var VERSION = '0.0.1';

if (Ember.libraries) {
  Ember.libraries.register('Ember Session', VERSION);
}

})();

(function() {

Ember.Session = Ember.Object.create({

  loginEndpoint: '/login',
  signupEndpoint: '/signup',
  logoutEndpoint: '/logout',
  reloadSessionEndpoint: '/reload',
  loginRoute: 'login',
  routeAfterLogin: 'campaigns.index',
  routeAfterSignup: 'welcome',
  routeAfterLogout: 'login',

  setup: function(app, options) {
    options                    = options || {};
    this.loginEndpoint         = options.loginEndpoint || this.loginEndpoint;
    this.logoutEndpoint        = options.logoutEndpoint || this.logoutEndpoint;
    this.signupEndpoint        = options.signupEndpoint || this.signupEndpoint;
    this.reloadSessionEndpoint = options.reloadSessionEndpoint || this.reloadSessionEndpoint;
    this.loginRoute            = options.loginRoute || this.loginRoute;
    this.routeAfterLogin       = options.routeAfterLogin || this.routeAfterLogin;
    this.routeAfterSignup      = options.routeAfterSignup || this.routeAfterSignup;
    this.routeAfterLogout      = options.routeAfterLogout || this.routeAfterLogout;

    // Register the session
    app.register('session:current', this, { instantiate: false, singleton: true });

    // Inject the session into all controllers, views, routes, models, and components
    Ember.A(['model', 'controller', 'view', 'route', 'component']).forEach(function(component) {
      app.inject(component, 'session', 'session:current');
    });
  }

});

})();

(function() {

Ember.AuthenticatedRoute = Ember.Route.extend({

  beforeModel: function(transition) {

    if (!this.session.get('account')) {

      this.redirectToLogin(transition);

    }
    
  },

  redirectToLogin: function(transition) {
    var loginController = this.controllerFor('login');
    loginController.set('attemptedTransition', transition);
    this.transitionTo(Ember.Session.loginRoute);
  }

});


})();

(function() {

Ember.ApplicationRoute = Ember.Route.extend({
  authenticate: function() {
    var self = this;

    if (localStorage.account) {

      // Reload the account into the session
      Ember.$.ajax({
        url: window.URL + Ember.Session.reloadSessionEndpoint,
        type: 'GET',
        async: false
      }).then(function(response){

        if(response.success){

          // Set the account in the session
          self.session.set('account', response.account);

        } else {
          self.transitionTo(Ember.Session.loginRoute);
        }

      });

    }
  },

  beforeModel: function(transition) {
    var self = this;

    self.authenticate();
  }
});

})();

(function() {

Ember.LogoutRoute = Ember.Route.extend({

  logout: function() {
    var self = this;

    if (localStorage.account) {

      Ember.$.ajax({
        url: window.URL + Ember.Session.logoutEndpoint,
        type: 'POST'
      }).then(function(response){

        delete localStorage.account;
        self.transitionTo(Ember.Session.routeAfterLogout);

      });

    } else {

      self.transitionTo(Ember.Session.loginRoute);

    }

  },

  beforeModel: function(transition) {
    var self = this;

    self.logout();
  }

});

})();

(function() {

Ember.LoginController = Ember.Controller.extend({

  actions: {

    login: function() {
      var self = this, data = this.getProperties('username', 'password');

      self.set('errorMessage', null);

      Ember.$.post(window.URL + Ember.Session.loginEndpoint, data).then(function(response) {

        if (response.success) {

          // Store the account in localStorage
          localStorage.account = response.account;

          // Set the account in the session
          self.session.set('account', response.account);

          self.transitionTo(Ember.Session.routeAfterLogin);

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


})();

(function() {

Ember.SignupController = Ember.Controller.extend({

  actions: {

    signup: function() {
      var self = this, data = this.getProperties('first_name', 'last_name', 'email', 'phone');

      self.set('errorMessage', null);

      Ember.$.post(window.URL + Ember.Session.signupEndpoint, data).then(function(response) {

        if (response.success) {

          localStorage.account = response.account;

          // Set the account in the session
          self.session.set('account', response.account);

          self.transitionTo(Ember.Session.routeAfterSignup);

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

})();

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/andrewreedy/ember-session/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
