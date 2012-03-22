$(function(){

	var currentProject  = {
		title : null,
		id : null
	};

	var Project = Backbone.Model.extend({		
		url : '/projects'
	});


	var ProjecCollection  = Backbone.Collection.extend({
		url : '/projects',
		model : Project

	});

	var Task =  Backbone.Model.extend({
		url : '/tasks',
		// validate : function (){
		// 	//make sure the title is not empty
		// }
		clear: function() {
	      this.destroy();
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
		initialize : function (){
			projectCollection.bind('add', this.addOne, this);
			projectCollection.bind('reset', this.reset, this);
			projectCollection.bind('all', this.render, this);
		},
		addOne : function (){
			console.log("add one called")
		},
		reset : function () {
			console.log("reset called");
		},
		
		template :  _.template($('#project-tmpl').text()),
		render : function (){
			this.el.empty();	
			window.model = this.model;
			var html  = this.template({ projects : _.toArray(this.model.models)});
			this.el.html(html);
			return this;
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
			console.log('task has been added')
			//tasksCollection.add(task);
			var st = new singleTaskView({model : task});
			$("#tasks_container").append(st.render());
		},
		addAll : function () {
			console.log('tasks reset');
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
					//self.addOne(res.model);
					//console.log(res.message);
				},
				error : function (model, res){
					console.log("there was an error saving the task");
				}
			});
		},
		clearInput : function(e){	
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new task")
				this.input.val("");
		},
		render : function(){
			console.log("render also called")
			this.el.empty();
			console.log(this.model)
			var html  = this.template({});
			this.el.html(html);

			this.input = $("#new_todo"); //only available after the render
			return this;
		}
	});

	var singleTaskView = Backbone.View.extend({
		el: '#tasks_container',
		//el : ' ',
		template : _.template($('#task-tmpl').text()),
		events : {
			'mouseover .menu-item' : 'showControls',
			'mouseout .menu-item' : 'hideControls',
			'click .delete' : 'deleteTask',
			'click .edit' : 'editTask'
		},
		initialize : function (){
			//this.model.bind('destroy', this.remove, this);
		},
		showControls : function (e){
			$(e.currentTarget).find(".controls").show()
		},
		hideControls : function (e){
			$(e.currentTarget).find(".controls").hide()
		},
		deleteTask : function (){
			console.log("deleting task");
			console.log(this.model);
			this.model.clear();
			// this.model.destroy({
			// 	success : function(model , res){

			// 	}
			// });
		},
		editTask : function (){
			console.log("editing task")
		},
		render : function (){
			var html  = this.template({ task : this.model});
			return html;
		}

	});

	var singleProjectView = Backbone.View.extend({
		el : '#project_container',
		events: {
	        'keypress #new_project':  'createNewProject',
	        'click' : 'clearInput'
    	},
    		
		initialize : function (){
			this.input = $("#new_project");
		},
		clearInput : function(e){
			
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new project")
				this.input.val("");
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
					projectCollection.add(res.model),
					console.log(res.message);
				},
				error : function(model, err){
					console.log("there was an error creating the project");
				}
			});
		},
		render : function (){
			//console.log("View created");
			//console.log("this has been called");
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
			console.log('called again');
			var self =  this;
			
		},
		showProjects : function () {
			projectCollection.fetch({
				success : function	(col, res){
					console.log(col)
					console.log(res)
					//show summarized view of tasks
					//this.currentProject.title = col.at(0).get("title");
					//this.log()
					//self.showTasks(self.currentProject);
				}
			});
			//console.log(data);
			var view =  new ProjectsView({model : projectCollection});
			view.render();

			var sp = new singleProjectView({});
			sp.render();
		},
		showTasks : function (id) {
			console.log("showing tasks")
			var id = $.trim(id);
			
			var project = projectCollection.find(function(n){
			  return n.get('_id') == id
			});
			
			var tasks = [];
			if(project){
				currentProject.title = project.get("title");
				currentProject.id = id;
				//console.log(project);
				
				tasksCollection.fetch({
					data : {
						projectId : id 
					},
					success : function (){
						var view = new TaskView({model : tasksCollection});
						view.render();
						tasksCollection.each(function (n){
							view.addOne(n);
						})
						
					
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
			console.log(id);
		},
		showSummarizedTasks : function(all){

		}
		

	});

	var navigatorRouter  = new Navigator();
	
});

