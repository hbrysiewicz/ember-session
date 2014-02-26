# Ember.Session

## Introduction

Ember Session (ES) is a simple and lightweight authentication / session library for Ember. 

It has only been tested using Node.js, Express, and Socket.io.

## Features

- Login
- Sign Up
- Authenticated Routes

If you want more features than Ember Session provides, file an issue. Feature requests/contributions are welcome but the goal is to keep things simple and fast.

## Example usage

```javascript

// Main App.js

// Init Ember Session
Ember.Application.initializer({
  name: 'session',
  initialize: function(container, application) {
    Ember.Session.setup(application);
  }
});

// Create Application
window.App = App = Ember.Application.create();


// Login Controller
App.LoginController = Ember.LoginController.extend({

});

// Logout Route
App.LogoutRoute = Ember.LogoutRoute.extend({

});

// Application Route
App.ApplicationRoute = Ember.ApplicationRoute.extend({

});

// Example Authenticated Route
App.MessagesIndexRoute = Ember.AuthenticatedRoute.extend({
    model: function() {
      return App.Message.findAll();
    }
});

// Signup Controller
App.SignupController = Ember.SignupController.extend({

});


```

## Building Ember Session
Ember Session uses [node.js](http://nodejs.org/) and [grunt](http://gruntjs.com/) as a build system,
These two libraries will need to be installed before building.

To build Ember Session, clone the repository, and run `npm install` to install build dependencies
and `grunt` to build the library.

Unminified and minified builds of Ember Session will be placed in the `dist` directory
