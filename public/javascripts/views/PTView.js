// Generated by CoffeeScript 1.3.3
(function() {

  (function(views) {
    views.PTView = Backbone.View.extend({
      template: _.template($("#pt_widgets_template").text()),
      initialize: function() {},
      render: function() {
        this.$el.html(this.template({}));
        return this;
      }
    });
  })(app.views, app.collections);

}).call(this);
