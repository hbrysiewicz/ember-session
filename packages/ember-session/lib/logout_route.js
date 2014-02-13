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