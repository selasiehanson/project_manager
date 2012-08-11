((views) ->
	views.SingleProjectView = Backbone.View.extend 
		tagName : 'tr',
		template : _.template($('#project-tmpl').text())
		events : 
			'mouseover .menu-item' : 'showControls'
			'mouseout .menu-item' : 'hideControls'
			'click button.delete_link' : 'deleteProject'
			'click button.edit_link' : 'editProject'
			'keypress .edit' : 'updateOnEnter'
			
		initialize :  () ->
			this.model.on 'change', this.render, this
			this.model.on 'destroy', this.remove, this
			return
			
		onClose : () ->
			this.model.off 'change', this.render
			this.model.off 'destroy', this.reder
			return

		showControls :  (e) ->
			$(e.currentTarget).find(".controls").show()
		
		hideControls :  (e) ->
			$(e.currentTarget).find(".controls").hide()
		
		deleteProject : () ->
			this.model.clear()
			
		editProject :  () ->
			this.$el.addClass("editing")
			this.input.val(this.model.get('title'))
			this.input.focus
			return
		updateOnEnter : (e) ->
	    	if e.keyCode is 13
	    		this.close()
	    	return

	    close : () ->
	    	value = this.input.val()
	    	if not value
	    		this.clear() 
	    	
	    	this.model.save(title : value)
	    	this.$el.removeClass "editing"
	    	return

		clearInput : (e) ->
			
			text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new project")
				this.input.val ""
		
		
		render : () ->
			html  = this.template
				project : this.model
			
			$(this.el).html html
			this.input = this.$('.edit');
			return this
	return
)(app.views)
