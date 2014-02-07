App.CampaignsIndexView = Ember.View.extend({
  layoutName: 'marketplace-layout',
  classNames: ['page-campaigns'],
  didInsertElement: function() {
  	reboot_init();

  }
});