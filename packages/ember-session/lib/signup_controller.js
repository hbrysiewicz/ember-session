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

          self.transitionToRoute(Ember.Session.routeAfterSignup);

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