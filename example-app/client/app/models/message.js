App.Message = Ember.Model.extend({
  from: attr(),
  to: attr(),
  message: attr(),
  subject: attr(),
  created: attr(Date),
  updated: attr(Date)
});

App.Message.url = "/messages";
App.Message.adapter = Ember.APIAdapter.create();