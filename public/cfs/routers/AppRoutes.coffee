((routes,collections, views, _project) ->
	routes.Navigator = Backbone.Router.extend
		data: null
		view : null
		routes : 
			"projects/task/:id" : 'showTasks'
			'project/all' : 'showProjects'
			'tasks/summary' : 'showSummarizedTasks' 
			'tasks/:id' : 'showTaskInfo'
			"dashboard" : 'showDashboard'
			# '/' : 'defaultRoute'	
			"*actions" : 'defaultRoute'
		initialize :  () ->
			##Backbone.history.loadUrl()
			Backbone.history.start()
			##console.log("called")
			return this
		
		defaultRoute :  () ->
			this.showDashboard()
		
		createPTView : () ->
			ptView = new views.PTView()
			views.centralPane.showView ptView
			return

		showProjects : () -> 
			#todo
			this.createPTView()
			collections.ProjectsCollection.fetch
				success : (col, res) ->
					collections.ProjectsCollection.pager()
					
					view =  new views.ProjectsContainer
						collection : collections.ProjectsCollection
					view.render()
					return 
			return
					
		showTasks :  (id) ->
			self = this
			id = $.trim(id)
			project = collections.ProjectsCollection.get(id)
			
			tasks = []
			if(project)
				_project.title = project.get("title")
				_project.id = id
				
				collections.tasksCollection.close()
				collections.tasksCollection = new app.collections.TasksCollection() 
				collections.tasksCollection.fetch
					data : 
						projectId : id 
					success :  () ->
						collections.tasksCollection.pager()
						if views.tasksContainer
							views.tasksContainer.onClose()
							# console.log "CLOSED-------------->"
						views.tasksContainer = new views.TasksContainer
							collection : collections.tasksCollection
						views.tasksContainer.render()
						
						##todo: set the first item as selected
					
				return
			
			else 
				_project.title = null
				_project.id  = null

			return
			
			## view = new TaskView(model : new Task(tasks))
			##$(".active").removeClass("active")
            ##$("#" + project.cid).addClass("active")
		
		showDashboard : () ->
			dashboard =  new views.Dashboard()
			views.centralPane.showView dashboard
			dashboard.updateGraphs()
			return

		showTaskInfo :  (id) ->
			# id = $.trim(id)
			# task = collections.TasksCollection.get(id)
			# data = 
			# 	task : task,
			# 	project : _project
			
			
			##console.log(data)
			## infoview = new InfoView(model : data)

			##infoview.render()
			
		
		clearTaskInfo :  () ->
			data = 
				task : 
					created_on : ''
					assignedTo : ''
					status : ''
				
				project : _project
		
			
			#infoview = new InfoView(model : data)
			#infoview.render()
		
		showSummarizedTasks : (all) ->
			self = this
			_project.title = null
			_project.id  = null
			collections.TasksCollection.fetch
				data : 
					projectId : null 
				
				success :  () ->
					view = new views.TasksView
						collection : collections.TasksCollection
					
					view.render()
					collections.TasksCollection.each(view.addOne)
					##show info for the first item
					first = collections.TasksCollection.at(0)
					if(first)
						self.showTaskInfo(first.id)	
					
					else 
						self.clearTaskInfo()
					
					##todo: set the first item as selected
	return
)(app.routes,app.collections,app.views,app.project)