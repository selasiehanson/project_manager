((views,models) ->
	views.ProjectsContainer = Backbone.View.extend
		el : $("#projects_container")
		template : _.template($("#projects-container-tmpl").text())
		events: 
	        'keypress #new_project':  'createNewProject'
	        'click #new_project' : 'clearInput'
		clearInput : (e) ->
			text = $.trim(this.input.val())
			if(text.toLocaleLowerCase() is "create new project")
				this.input.val("")
			return

		createNewProject : (e) ->
			
			text = this.input.val()
			if not text or e.keyCode isnt 13
			 	return
			self =  this
			this.clearInput()
			p = new models.Project(
				title : text
			)
			p.save({},{
				success :  (model, res) ->
					self.collection.clean()
					self.collection.fetch
					 	success : (col, res) ->
					 		self.collection.pager() 	
					 		self.input.val("")	
					 		return
					 	
					 	silent:true
					return
					
				error : (model, err) ->
					##console.log("there was an error creating the project")
				
			})
			return
		render : () ->
			this.$el.empty()
			html = this.template({})
			this.$el.html html
			if views.projectsView
				views.projectsView.onClose
			
			views.projectsView = new views.ProjectsView
				collection : this.collection

			if views.projectPager
				views.projectPager.onClose	

			views.projectPager = new views.ProjectsPager
				collection : this.collection
				template : "#pagination-tmpl"

			
			$("#project_navigation").html views.projectPager.render().el
			views.projectsView.render()

			this.input = $("#new_project")
			return
		onClose: () ->
	return
)(app.views,app.models)