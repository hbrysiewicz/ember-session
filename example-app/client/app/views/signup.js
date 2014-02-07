App.SignupView = Ember.View.extend({
	formSubmitted: false,
	layoutName: 'landing-layout',
	classNames: ['page-landing', 'landing-v1'],
	didInsertElement: function() {
		reboot_init();

		// Focus on the full name field
		$('#form-signup--first_name').focus();

		// Setup form validation
		$('#form-signup--first_name, #form-signup--last_name').addClass('validate').data('validation', [
			{ rule: 'required', group: '.half', message: 'Please enter your first and last name here' }
		]);
		$('#form-signup--email').addClass('validate').data('validation', [
			{ rule: 'required', message: 'Please enter your email address here' },
			{ rule: 'email', message: 'Please enter a valid email address' }
		]);
		$('#form-signup--phone').mask('(999) 999-9999');

		$('#form-signup').reboot_validation();

		$('#form-signup').on('submit', function() {
			if ($('#form-signup').reboot_validation('exec')) {
				if (this.formSubmitted) {
	  			return true;
	  		}

	  		this.formSubmitted = true;
	  		$('#modal-processing').reboot_modal({
	  			width: '500px'
	  		});

	  		setTimeout(function() {
	  			$('#form-signup').submit();
	  		}, 3000);

	  		return false;
			}
		});
	}
});