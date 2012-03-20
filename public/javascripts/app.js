$(function(){
	var Project = Backbone.Model.extend({		
		
	});


	var ProjecCollection  = Backbone.Collection.extend({
		url : '/projects',
		model : Project
	});

	var ProjectsView =  Backbone.View.extend({
		el : $("#projects_and_tasks"),
		template :  _.template($('#project-tmpl').text()),
		render : function (){
			this.el.empty();	
			window.model = this.model;
			var html  = this.template({ projects : _.toArray(this.model.models)});
			this.el.html(html);
			return this;
		}
	});

	var ProjectsMiniView = Backbone.View.extend ({
		el : $('#projects'),
		template : _.template($('#project-tmpl').text()), 

		render : function (){
			this.el.empty();
			var html  = this.template({ projects : _.toArray(this.model.models)});
			this.el.html(html);
			return this;
		}
	});

	var TaskView = Backbone.View.extend({
		//el : $('#tasks_list'),
		el : $('#projects_and_tasks'),
		template : _.template($('#tasks-tmpl').text()),
		render : function(){
			this.el.empty();
			var html  = this.template({ tasks : _.toArray(this.model.attributes)});
			this.el.html(html);
			return this;

		}
	});

	var singleTaskView = Backbone.View.extend({

		events: {
	        'keypress #new_todo':  'createNewTask',
	        'click' : 'clearInput'
    	},
    		
		initialize : function (){
			this.input = $("#new_todo");
		},
		createNewTask : function (e){
			
			var text = this.input.val();
			if(!text || e.keyCode !=13)
			 	return;
			console.log(text);
		},
		clearInput : function(e){
			
			var text = $.trim(this.input.val());
			if(text.toLocaleLowerCase() == "create new task")
				this.input.val("");
		},
		render : function (){
			//console.log("View created");

			return this;
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
			console.log(text);
			this.clearInput();
		},
		
		render : function (){
			//console.log("View created");
			console.log("this has been called");
			return this;
		}

	});

	var Task =  Backbone.Model.extend({
		
		// validate : function (){
		// 	//make sure the title is not empty
		// }	

	});

	var TaskCollection = Backbone.Collection.extend({
		model : Task
	});


	var projectCollection  = new ProjecCollection(); 
	//projectCollection.fetch({add: true});
	var Navigator = Backbone.Router.extend ({
		data: null,
		view : null,
		currentProject : null,
		routes : {
			"projects/:title" : 'showTasks',
			'project/all' : 'showProjects',
			'tasks/summary' : 'showSummarizedTasks' ,
			'tasks/:id' : 'showTaskInfo',
			'*actions' : 'defaultRoute'	
		},
		
		initialize : function (){
			
			
			//this.view = new ProjectsMiniView({model : this.data});
			//this.view.render();

			//var st = new singleTaskView({el: 'body'});
			//st.render();
			//Backbone.history.loadUrl();
			Backbone.history.start();
			//console.log("called");
			return this;
		},
		defaultRoute : function () {
			console.log('called again');
			var self =  this;
			projectCollection.fetch({
				add : true,
				success : function	(col, res){
					console.log(col)
					console.log(res)
					this.currentProject = col.at(0).get("title");
					self.showTasks(self.currentProject);
				}
			});
			
		},
		showProjects : function () {
			//console.log(data);
			var view =  new ProjectsView({model : projectCollection});
			view.render();

			var sp = new singleProjectView({});
			sp.render();
		},
		showTasks : function (title) {

			title = $.trim(title);

			var project = projectCollection.find(function(n){
			  return n.get('title') == title
			});

			var tasks = [];
			if(project){
				this.currentProject = title;
				tasks = project.get("tasks");
				$(".active").removeClass("active");
            	$("#" + project.cid).addClass("active");
				//var data  = new TaskCollection(tasks);
			}
			var view = new TaskView({model : new Task(tasks)});
			view.render();	
			var st = new singleTaskView({el: '#tasks_container'});
			st.render();
		},
		showTaskInfo : function (id){
			console.log(id);
		},
		showSummarizedTasks : function(all){

		}
		

	});

	var navigatorRouter  = new Navigator();
	
});

