((models)->
	params =
		urlRoot : "/projects"
		idAttribute : "_id"
		clear : () -> 
			this.destroy({wait:true})
	models.Project = Backbone.Model.extend params
	return
)(app.models)