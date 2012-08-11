((views) ->
	views.CentralContainer = Backbone.View.extend
		el : $("#stage")
		initialize : () ->
		
		showView : (view) ->
			if this.currentView
				this.currentView.close()
			this.currentView = view
			this.currentView.render()

			this.$el.html this.currentView.el
			return

	return
)(app.views)