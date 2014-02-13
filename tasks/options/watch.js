module.exports = {
  options: {
    nospawn: true,
  },
  code: {
    files: ['packages/ember-session/lib/**/*.js'],
    tasks: ['jshint:development', 'neuter'],
  },
  test: {
    files: ['packages/ember-session/tests/**/*.js'],
    tasks: ['jshint:development', 'build_test_runner_file'],
  }
};
