((views, models,_project) ->
	views.TasksContainer =  Backbone.View.extend
		el : $('#tasks_container')

		template : _.template($("#tasks-container-tmpl").text())
	
		events: 
	        'keypress #new_todo':  'createNewTask'
	        'click #new_todo' : 'clearInput'

	    initialize : () ->
	    	this.collection.on "change", this.change , this
	    	this.collection.on "destroy", this.modelRemoved, this
	    change : () ->
	    	console.log "collection has changed"
	    	this.updatePager()
	    clearInput : (e) ->
	    	text = $.trim(this.input.val())
	    	if(text.toLocaleLowerCase() == "create new task")
	    		this.input.val ""
	    	return
		onClose : () ->	
			this.collection.off "change", this.change , this	
			this.collection.off "destroy", this.modelRemoved, this
			return
		modelRemoved : () ->
			this.updatePager()
		render : () ->
			this.$el.empty()
			html = this.template({})
			this.$el.html html
			
			
			this.updatePager()
			this.updateView()
			this.input = $("#new_todo")
			return
		updateView : () ->
			if views.tasksView
				views.tasksView.onClose()
				
			views.tasksView = new views.TasksView
				collection : this.collection

			$("#tasks_view tbody").html views.tasksView.render().el
			views.tasksView.renderTasks();
			$("#tasks_project_header").text " : " + _project["title"]

		updatePager : () ->
			if views.tasksPager
				views.tasksPager.onClose()
				
			self = this
			views.tasksPager = new views.TasksPager
						collection : self.collection
						template : "#tasks_pagination-tmpl"
						stats : self.computeStats()
			$("#tasks_navigation").html views.tasksPager.render().el
		computeStats : () ->
			cols = this.collection
			done = cols.where status : "done"
			remaining = cols.info().totalRecords - done.length
			stats = 
				remaining : remaining
				done : done.length

		createNewTask : (e) ->
			text = this.input.val()
			if not text or e.keyCode isnt 13
			 	return

			task =  new models.Task(
				title : text 
				project : _project.id
			)

			self = this
			this.collection.close();
			this.collection = new app.collections.TasksCollection() 
			task.save({}, {
				success : (model, res) ->
					self.collection.fetch
						data : 
							projectId : _project.id 
					
						success :  () ->
							self.collection.pager()
							self.updateView()
							self.updatePager()
							self.input.val("")
					return
				
				error : (model, res) ->
					return
				
			})

			return
	return
)(app.views,app.models,app.project)