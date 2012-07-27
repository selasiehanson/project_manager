// Generated by CoffeeScript 1.3.3
(function() {

  (function(collections, model, paginator) {
    var params;
    params = {
      model: model,
      paginator_core: {
        type: 'GET',
        dataType: 'json',
        url: '/tasks'
      },
      paginator_ui: {
        firstPage: 1,
        currentPage: 1,
        perPage: 5,
        totalPages: 10
      }
    };
    collections.TasksCollection = paginator.clientPager.extend(params);
  })(app.collections, app.models.Task, Backbone.Paginator);

}).call(this);
