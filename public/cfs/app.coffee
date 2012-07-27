window.app = 
	views : {}
	collections : {}
	models: {},
	routes : {},
	project : {}
$ ->
	app.project["title"] = null
	app.project["id"] = null
	app.collections.ProjectsCollection = new app.collections.PaginatedCollection()
	app.collections.tasksCollection = new app.collections.TasksCollection();
	app.views.centralPane =  new app.views.CentralContainer()
	app.routes.navigator = new app.routes.Navigator();
	##app.routes.navigator.start()
	return
