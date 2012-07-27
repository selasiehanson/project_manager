((collections,model,paginator) -> 

	params =
		model : model
		paginator_core: 
			type: 'GET'
			dataType: 'json'
			url: '/projects'

		paginator_ui: 
			firstPage: 1

			currentPage: 1

			perPage: 5

			totalPages: 10		

		# server_api: 
			# '$filter': 'substringof(\'america\',Name)'

			# '$top': () ->  this.totalPages * this.perPage 

			# '$skip': () -> this.totalPages * this.perPage

			# 'orderby': 'ReleaseYear'

			# '$format': 'json'

			# '$inlinecount': 'allpages'
			# '$callback': 'callback'                                     
		parse : (response) ->
			response

	collections.PaginatedCollection = paginator.clientPager.extend params
	return
)(app.collections,app.models.Project,Backbone.Paginator)
