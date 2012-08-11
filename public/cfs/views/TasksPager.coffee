((views)->
	params =
		
		events :
			'click a.first' : 'gotoFirst'
			'click a.previous' : 'gotoPrevious'
			'click a.next' : 'gotoNext'
			'click a.last' : 'gotoLast'

		initialize : () ->
			# this.collection.on 'change', this.change,this
			this.collection.on 'reset', this.render,this
			# this.collection.on "destroy", this.modelRemoved, this
			self = this
			tpl =  this.options.template
			this.template = _.template($(tpl).html())
			this.stats = this.options.stats
			return
		onClose : () ->
			# this.collection.off 'change', this.change
			this.collection.off 'reset', this.render
			# this.collection.off 'destroy', this.modelRemoved
			return

			
		modelRemoved : (e) ->
			self = this;
			this.collection.clean()
			this.collection.fetch
			 	success : (col, res) ->
			 		self.collection.pager()
			 		info = self.collection.info()
			 		totalPages = info.totalPages
			 		currentPage =  info.currentPage
			 		if currentPage > totalPages
			 			self.collection.previousPage()
			
			 		#todo : page for page stuff here		
			 		return
			 	
			 	silent:true
			return
			
		render : () ->
			$(this.el).empty()
			html = this.template 
				page : this.collection.info()
				stats : this.stats
			$(this.el).html html
			return this

		gotoFirst : (e) ->
			e.preventDefault()
			this.collection.goTo(1)
			return

		gotoPrevious : (e) ->
			e.preventDefault()
			this.collection.previousPage()
			return

		gotoNext : (e) ->
			e.preventDefault()
			info = this.collection.info()
			totalPages = info.totalPages
			currentPage =  info.currentPage
			if currentPage < totalPages
				this.collection.nextPage()
			return

		gotoLast : (e) ->
			e.preventDefault()
			this.collection.goTo(this.collection.information.lastPage)
			return

	views.TasksPager = Backbone.View.extend params
	return
)(app.views)