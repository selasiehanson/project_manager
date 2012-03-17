$(function(){
	var Project = Backbone.Model.extend({		
		
	});


	var ProjecCollection  = Backbone.Collection.extend({
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
	        'keypress #new_todo':  'createNewTask'
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
		
		render : function (){
			//console.log("View created");

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


	var Navigator = Backbone.Router.extend ({
		data: null,
		view : null,
		currentProject : null,
		routes : {
			"projects/:title" : 'showTasks',
			'project/new' : 'newProject',
			'tasks/all' : 'defaultRoute' ,
			'tasks/:id' : 'showTaskInfo',
			'*actions' : 'defaultRoute'	
		},
		
		initialize : function (){
			
			var data = [
				{title : "Project 1", tasks :["one" , "two","three","four","five","six","seven","eight", "nine", "ten"]},
				{title : "Project 2", tasks :["one" , "two","three","four","five","six","seven","eight"]},
				{title : "Project 3", tasks :["one" , "two","three","four","five","six"]},
				{title : "Project 4", tasks :["one" , "two","three","four"]},
				{title : "Project 5", tasks :["one" , "two"]},
				{title : "Project 6", tasks :['one'] }
			];
			
			window.data = this.data = new ProjecCollection(data);
			
			//this.view = new ProjectsMiniView({model : this.data});
			//this.view.render();

			//var st = new singleTaskView({el: 'body'});
			//st.render();
			Backbone.history.loadUrl();

			return this;
		},
		defaultRoute : function () {
			this.currentProject = this.data.at(0).get("title");
			this.showTasks(this.currentProject);
		},
		newProject : function () {
			//console.log(data);
			var view =  new ProjectsView({model : this.data});
			view.render();
		},
		showTasks : function (title) {

			title = $.trim(title);

			var project = data.find(function(n){
			  return n.get('title') == title
			});

			if(project){
				this.currentProject = title;
				var tasks = project.get("tasks");
				$(".active").removeClass("active");
            	$("#" + project.cid).addClass("active");
				//var data  = new TaskCollection(tasks);
				var view = new TaskView({model : new Task(tasks)});
				view.render();	
				var st = new singleTaskView({el: 'body'});
				st.render();
			}
			
		},
		showTaskInfo : function (id){
			console.log(id);
		}

		

	});

	var navigatorRouter  = new Navigator();
	Backbone.history.start();
});

