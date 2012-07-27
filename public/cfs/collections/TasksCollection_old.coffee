((model,collections)->
	collections.TasksCollection  = Backbone.Collection.extend
		model : model
		url : '/tasks'
	
	return
)(app.models.Task,app.collections)
