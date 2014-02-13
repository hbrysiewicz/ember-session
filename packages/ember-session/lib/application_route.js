Ember.ApplicationRoute = Ember.Route.extend({
  authenticate: function() {
    var self = this;

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
        self.transitionToRoute(Ember.Session.loginRoute);
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