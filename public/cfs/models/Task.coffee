((models) ->
	params = 
		urlRoot : '/tasks'
		idAttribute: "_id"
		clear: () ->
	    	this.destroy()
	    toggle : () ->
	    	status = this.get "status" 
	    	if status is "pending"
	    		status = "done"
	    	
	    	else if status is "done"
	    		status = "pending"
	    	
	    	this.set({status: status})
	    	this.save()
	    
	models.Task = Backbone.Model.extend params
	return
)(app.models)