Ember.APIAdapter = Ember.Adapter.extend({
  find: function(record, id) {
    return $.ajax(window.APIURL + record.constructor.url + "/" + id).then(function(data) {
      record.load(id, data)
    });
  },
  findAll: function(klass, records) {
    return $.ajax(window.APIURL + klass.url).then(function(data) {
      records.load(klass, data)
    });
  },
  findMany: function(klass, records, ids) {

  },
  findQuery: function(klass, records, params) {
    return $.ajax({
      url: window.APIURL + klass.url,
      data: params,
    }).then(function(data) {
      records.load(klass, data)
    });
  },
  createRecord: function(record) {

  },
  saveRecord: function(record) {

  },
  deleteRecord: function(record) {

  }
});