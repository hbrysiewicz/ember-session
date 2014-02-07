App.LoginView = Ember.View.extend({
  layoutName: 'landing-layout',
  classNames: ['login'],
  didInsertElement: function() {
  	reboot_init();

  	$('#form-login--username').focus();
  }
});