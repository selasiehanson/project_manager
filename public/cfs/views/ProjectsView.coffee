((views,_project)->
	views.ProjectsView = Backbone.View.extend 
		
		el : "#projects_view  tbody"
		template :  _.template($('#projects-tmpl').text())
		addOne :  (project) ->
			sp = new views.SingleProjectView({model : project})
			el = $("#projects_view  tbody")
			el.prepend(sp.render().el)
			return
		
		initialize : () ->
			this.collection.on('add', this.addOne, this)
			this.collection.on('reset', this.reset, this)
			#this.collection.on('all', this.reset, this)

			return
		onClose : () ->
			this.collection.off 'add', this.addOne
			this.collection.off 'reset', this.reset
			return
		reset : () ->
			console.log "xxx"
			this.$el.empty();
			this.collection.each(this.addOne)
		
		render : () ->
			self =  this
			$(self.el).empty()
			html  = this.template({})
			$(self.el).html(html)
			this.collection.each(this.addOne)
			
			
	return
)(app.views,app.project)
		