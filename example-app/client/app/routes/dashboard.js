App.CampaignsIndexRoute = Ember.Route.extend(ES.AuthenticatedRouteMixin, {
  model: function() {
    console.log(this.get('session'));
    return App.Campaign.findAll();
  },
  setupController: function(controller, model) {
      controller.set('content', model);
      controller.set('types', App.Type.findAll());
  }
});

App.CampaignsEditRoute = Ember.Route.extend(ES.AuthenticatedRouteMixin, {
  model: function(params) {
    return App.Campaign.find(params.id);
  },
  setupController: function(controller, model) {
    controller.set('content', model);
    controller.set('types', App.Type.findAll());
  }
});

App.CampaignsCreateRoute = Ember.Route.extend(ES.AuthenticatedRouteMixin, {
  model: function() {
    return App.Type.findAll();
  },
  setupController: function(controller, model) {
      controller.set('content', model);
      controller.set('types', App.Type.findAll());
  }
});