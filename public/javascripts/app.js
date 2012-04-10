$(function(){

	var currentProject  = {
		title : null,
		id : null
	};

	// Backbone.sync = function(method, model) {
	// 	//console.log(method + ": " + model.url);
	// };

	var Project = Backbone.Model.extend({		
		urlRoot : '/projects',
		idAttribute: "_id",
		clear : function () {
			this.destroy();
		}
	});

	
	var ProjecCollection  = Backbone.Collection.extend({
		url : '/projects',
		model : Project

	});

	var Task =  Backbone.Model.extend({
		urlRoot : '/tasks',
		idAttribute: "_id",
		// validate : function (){
		// 	//make sure the title is not empty
		// }
		clear: function() {
	    	this.destroy();
	    },
	    toggle : function(){
	    	var status = this.get("status");
	    	if(status == "pending"){
	    		status = "done";
	    	}
	    	else if(status == "done"){
	    		status = "pending";
	    	}
	    	this.set({status: status});
	    	this.save();
	    }

	});

	var TaskCollection = Backbone.Collection.extend({
		model : Task,
		url : '/tasks'
	});

	var projectCollection  = new ProjecCollection(); 
	var tasksCollection  = new TaskCollection();

	var ProjectsView =  Backbone.View.extend({
		el : $("#projects_and_tasks"),
		events: {
	        'keypress #new_project':  'createNewProject',
	        'click' : 'clearInput'
	    },
		initialize : function (){
			projectCollection.bind('add', this.addOne, this);
			projectCollection.bind('reset', this.reset, this);
			//projectCollection.bind('all', this.render, this);
		},
		addOne : function (project){
			var sp = new singleProjectView({model : project});
			$("#project_container .houser").append(sp.render().el);
		},
		createNewProject : function (e){
			
			var text = this.input.val();
			if(!text || e.keyCode !=13)
			 	return;
			
			this.clearInput();
			var p = new Project({
				title : text,
				project : currentProject.id
			});
			p.save({},{
				success : function (model, res){
					projectCollection.add(res.model)
					//console.log(res.message);
				},
				error : function(model, err){
					//console.log("there was an error creating the project");
				}
			});
		},
		clearInput : function(e){	
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new project")
				this.input.val("");
		},
		reset : function () {
			projectCollection.each(this.addOne);
		},
		
		template :  _.template($('#projects-tmpl').text()),
		render : function (){
			this.$el.empty();	
			var html  = this.template({});
			this.$el.html(html);
			this.input = $("#new_project");
			return this;
			//console.log("render called");
		}
	});

	var TaskView = Backbone.View.extend({
		el : $('#projects_and_tasks'),
		events: {
	        'keypress #new_todo':  'createNewTask',
	        'click' : 'clearInput'

    	},
		template : _.template($('#tasks-tmpl').text()),
		initialize : function (){
			tasksCollection.bind('add', this.addOne,this);
			tasksCollection.bind('reset', this.addAll, this);
			//tasksCollection.bind('all',this.render,this);
		},
		addOne : function (task){
			
			var st = new singleTaskView({model : task});
			$("#tasks_container .houser").append(st.render().el);
		},
		addAll : function () {
			tasksCollection.each(this.addOne)
		},
		createNewTask : function (e){
			var self  = this;
			var text = this.input.val();
			if(!text || e.keyCode !=13)
			 	return;
			var task =  new Task({
				title : text, 
				project : currentProject.id
			});
			task.save({},{
				success : function(model, res){
					tasksCollection.add(res.model);
					self.input.val("");
				},
				error : function (model, res){
					
				}
			});
		},
		clearInput : function(e){	
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new task")
				this.input.val("");
		},
		render : function(){
			this.$el.empty();
			var html  = this.template({});
			this.$el.html(html);

			this.input = $("#new_todo"); //only available after the render
			return this;
		}
	});

	var singleTaskView = Backbone.View.extend({
		//el: '#tasks_container',
		tagName : 'div',
		template : _.template($('#task-tmpl').text()),
		events : {
			'mouseover .menu-item' : 'showControls',
			'mouseout .menu-item' : 'hideControls',
			'click a.delete_link' : 'deleteTask',
			'click a.edit_link' : 'editTask',
			'click .checkbox' : 'toggleDone',
			'keypress .edit' : 'updateOnEnter',
			'click .menu-item': 'makeActive'
		},
		initialize : function (){
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		showControls : function (e){
			$(e.currentTarget).find(".controls").show()
		},
		hideControls : function (e){
			$(e.currentTarget).find(".controls").hide()
		},
		deleteTask : function (){
			this.model.clear();
		},
		editTask : function (){
			this.$el.addClass("editing");
			this.input.val(this.model.get('title'));
			this.input.focus();
		},
		toggleDone: function(e) {
			console.log(e);
			this.model.toggle();
			var item = $(this.el).find(".the-item a");
			var status = this.model.get("status");
			
	    	if(status=="done"){
	    		item.addClass("done")
	    	}else if(status='pending') {
	    		item.removeClass("done");
	    	}
	    },
	    updateOnEnter : function(e){
	    	if(e.keyCode == 13){
	    		this.close();
	    	}
	    },
	    close : function (){
	    	var value = this.input.val();
	    	if(!value)
	    		this.clear();
	    	
	    	this.model.save({title : value});
	    	this.$el.removeClass("editing");
	    },
	    makeActive : function () {
	    	$('.menu-item').removeClass('active')
	    	$(this.el).find('.menu-item').addClass('active');
	    },
		render : function (){
			var title = this.model.get("title");
			title = title[0].toUpperCase() + title.slice(1)
			this.model.set({title : title});
			var html  = this.template({ task : this.model});
			$(this.el).html(html);
			window.el  = $(this.el)
			this.input = this.$('.edit');
			return this;
		}

	});

	var singleProjectView = Backbone.View.extend({
		tagName : 'div',
		template : _.template($('#project-tmpl').text()),
		events : {
			'mouseover .menu-item' : 'showControls',
			'mouseout .menu-item' : 'hideControls',
			'click a.delete_link' : 'deleteProject',
			'click a.edit_link' : 'editProject'
		},
    		
		initialize : function (){
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		showControls : function (e){
			$(e.currentTarget).find(".controls").show()
		},
		hideControls : function (e){
			$(e.currentTarget).find(".controls").hide()
		},
		deleteProject : function(){
			this.model.clear();
		},
		editProject : function (){

		},
		clearInput : function(e){
			
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new project")
				this.input.val("");
		},
		
		render : function (){
			var html  = this.template({project : this.model});
			
			$(this.el).html(html);
			return this;
		}
	});

	var InfoView = Backbone.View.extend({
		el : $("#task_info_panel"),
		template : _.template($('#task-info-tmpl').html()),
		render : function (){
			
			this.$el.empty();
			var html = this.template({info : this.model});
			this.$el.html(html);
			return this;
		}
	});
	//projectCollection.fetch({add: true});
	var Navigator = Backbone.Router.extend ({
		data: null,
		view : null,
		routes : {
			"projects/:id" : 'showTasks',
			'project/all' : 'showProjects',
			'tasks/summary' : 'showSummarizedTasks' ,
			'tasks/:id' : 'showTaskInfo',
			'*actions' : 'defaultRoute'	
		},
		
		initialize : function (){
			//Backbone.history.loadUrl();
			Backbone.history.start();
			//console.log("called");
			return this;
		},
		defaultRoute : function () {
			
			var self =  this;
			
		},
		showProjects : function () {
			projectCollection.fetch({
				success : function	(col, res){
					
					//show summarized view of tasks
					//this.currentProject.title = col.at(0).get("title");
					//this.log()
					//self.showTasks(self.currentProject);

					var view =  new ProjectsView({model : projectCollection});
					view.render();

					projectCollection.each(view.addOne);
				}
			});
			
			
			//var sp = new singleProjectView({});
			//sp.render();
		},
		showTasks : function (id) {
			var self = this;
			var id = $.trim(id);
			var project = projectCollection.get(id);
			
			var tasks = [];
			if(project){
				currentProject.title = project.get("title");
				currentProject.id = id;
				
				
				tasksCollection.fetch({
					data : {
						projectId : id 
					},
					success : function (){
						var view = new TaskView({model : tasksCollection});
						view.render();
						tasksCollection.each(view.addOne);
						//show info for the first item
						var first = tasksCollection.at(0);
						if(first){
							self.showTaskInfo(first.id);	
						}
						else {
							self.clearTaskInfo();
						}
						//todo: set the first item as selected
					}
				});
			}
			else {
				currentProject.title = null;
				currentProject.id  = null;
			}
			//var view = new TaskView({model : new Task(tasks)});
			//$(".active").removeClass("active");
            //$("#" + project.cid).addClass("active");
		},
		showTaskInfo : function (id){
			var id = $.trim(id);
			var task = tasksCollection.get(id);
			var data = {
				task : task,
				project : currentProject
			}
			
			//console.log(data);
			var infoview = new InfoView({model : data});

			infoview.render();
			
		},
		clearTaskInfo : function (){
			var data = {
					task : {
						created_on : '',
						assignedTo : '',
						status : ''
					},
					project : currentProject
			}
			
			var infoview = new InfoView({model : data});
			infoview.render();
		},
		showSummarizedTasks : function(all){

		}
		

	});

	var navigatorRouter  = new Navigator();
	
});
