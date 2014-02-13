module.exports = {
  options: {
    filepathTransform: function(filepath) {
      filepath.replace('ember-session', 'ember-session/lib');
      return 'packages/' + filepath.replace('ember-session', 'ember-session/lib');
    }
  },
  'dist/ember-session.js': 'packages/ember-session/lib/main.js'
};
