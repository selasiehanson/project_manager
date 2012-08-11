((views, models,_project) ->
	views.TasksContainer =  Backbone.View.extend
		template : _.template($("#tasks-container-tmpl").text())
	
		events: 
	        'keypress #new_todo':  'createNewTask'
	        'click #new_todo' : 'clearInput'

	    initialize : () ->
	    	this.collection.on "change", this.change , this
	    	this.collection.on "destroy", this.modelRemoved, this
	    change : () ->
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
			$('#tasks_container').html this.el
			
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
			_cols = this.collection.origModels
			all = _.select  _cols, (n) ->
				n.get("status") == "done"

			done  = all.length
			remaining = cols.info().totalRecords - done
			stats = 
				remaining : remaining
				done : done

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