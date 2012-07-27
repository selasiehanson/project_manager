Backbone.View.prototype.close  = () ->
	this.remove()
	this.unbind()
	if this.onClose
		this.onClose()
	return

Backbone.Collection.prototype.close = () ->
	this.remove()
	this.unbind()
	return