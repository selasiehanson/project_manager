((views) ->
	views.SingleTaskView = Backbone.View.extend
		tagName : 'tr',
		template : _.template($('#task-tmpl').text())
		events : 
			'mouseover .menu-item' : 'showControls'
			'mouseout .menu-item' : 'hideControls'
			'click button.delete_link' : 'deleteTask'
			'click button.edit_link' : 'editTask'
			'click .checkbox' : 'toggleDone'
			'keypress .edit' : 'updateOnEnter'
			'click .menu-item': 'makeActive'
		
		initialize : () ->
			this.model.on 'change', this.render, this
			this.model.on 'destroy', this.remove, this
			return
		
		showControls : (e) ->
			$(e.currentTarget).find(".controls").show()
			return
		
		hideControls : (e) ->
			$(e.currentTarget).find(".controls").hide()
			return
		
		deleteTask : () ->
			this.model.clear()
			return
		
		editTask : () ->
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
	    	this.$el.removeClass("editing")
	    	return

		onClose : () ->
			this.model.off "change", this.render
			this.model.off "destroy", this.remove
			return

		render : () ->
			#convert these to lower case
			title = this.model.get("title")
			title = title[0].toUpperCase() + title.slice(1)
			this.model.set(title : title)
			html  = this.template
				task : this.model
			$(this.el).html html
			this.input = this.$('.edit')
			return this

		makeActive : () ->

		
		toggleDone : (e) ->
			this.model.toggle()
			item = $(this.el).find(".the-item a");
			status = this.model.get("status");
			if( status == "done")
				item.addClass "done"
			else if status == "pending"
				item.removeClass "done"

			return
	return
)(app.views)