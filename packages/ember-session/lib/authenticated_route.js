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
