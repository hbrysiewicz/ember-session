Ember.LoginController = Ember.Controller.extend({

  actions: {

    login: function() {
      var self = this, data = this.getProperties('username', 'password');

      self.set('errorMessage', null);

      Ember.$.post(window.URL + Ember.Session.authEndpoint, data).then(function(response) {

        if (response.success) {

          // Store the account in localStorage
          localStorage.account = response.account;

          // Set the account in the session
          self.session.set('account', response.account);

          self.transitionToRoute(Ember.Session.routeAfterLogin);

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
