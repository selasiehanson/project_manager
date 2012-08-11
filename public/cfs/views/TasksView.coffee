((views,models,_project) ->
	views.TasksView = Backbone.View.extend 
		##el : $('#projects_and_tasks')
		
		
		template : _.template($('#tasks-tmpl').text())
		
		statsTemplate : _.template($("#task-stats-tmpl").text())
		
		initialize : () ->
			this.collection.on 'add', this.addOne,this
			this.collection.on 'reset', this.reset,this
			return
		onClose : () ->
			this.collection.off "add", this.addOne
			this.collection.off "reset", this.reset
			return	
		addOne : (task) ->
			st = new views.SingleTaskView
				model : task
			# this call should not be here however since this is a callback it has no eceess to this.el
			el = $("#tasks_view  tbody")
			el.prepend(st.render().el)
			return
		
		addAll : () ->
			this.collection.each this.addOne
		
		reset : () ->
			# this jquery call should ideally not be here
			el = $("#tasks_view  tbody").empty()
			this.$el.empty()
			this.collection.each this.addOne
		renderTasks : () ->
			this.collection.each(this.addOne)
		render : () ->
			self =  this
			$(this.el).empty()
			html  = this.template({})
			$(this.el).html html
			
			return this
	return

)(app.views,app.models,app.project)