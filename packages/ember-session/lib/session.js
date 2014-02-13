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