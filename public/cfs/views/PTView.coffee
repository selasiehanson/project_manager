((views) ->
	views.PTView =  Backbone.View.extend
		template : _.template($("#pt_widgets_template").text())
		initialize : () ->

		render : () ->
			this.$el.html this.template({})
			return this;
	return
)(app.views,app.collections)