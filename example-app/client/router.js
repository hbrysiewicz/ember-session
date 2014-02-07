App.Router.reopen({
	location: 'history'
});

App.Router.map(function() {

	//Landing Routes
	this.route("login");
	this.route("logout");
	this.route("signup");
	this.route("publisher-signup");
	this.route("privacy");
	this.route("terms");
	this.route("contact");
	this.route("about");


	//Marketplace Routes
	this.resource("campaigns", function() {
		this.route("create");
		this.route("edit", { path: '/edit/:id' });
	});

	this.resource("messages", function() {
		this.route("compose");
		this.route("view", { path: '/view/:id' });
	});

  this.resource("leads", function() {
  	this.route("lead", { path: '/:id' });
  	this.route("snapshot");
  });

	this.route("settings");

	this.route("company");

	this.resource("reports", function(){
		this.route("geographic");
		this.route("contactrate");
		this.route("soldrate");
		this.route("spend");
	});

	this.route("billing");
	this.route("marketplace-privacy");
	this.route("marketplace-terms");



	//Admin Routes
	this.resource("admin", function(){
		this.route("login");

		this.resource("admin.reports", { path: '/reports' }, function(){

		});

		this.resource("admin.types", { path: '/types' }, function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.users", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.accounts", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.companies", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.roles", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.forms", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.fields", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("admin.publishers", function(){
			this.route("create", { path: '/create' });
			this.route("edit", { path: '/edit/:id' });
		});

		this.resource("transactions", function(){

		});
	});

});