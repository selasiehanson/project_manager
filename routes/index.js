var mongoose = require('mongoose');
var Project = require('../models/Project');
var Task =  require('../models/Task');
var Step = require('step');

var user = {
	username : 'Selasie Hanson',
}

/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index.html');
};

exports.index2 =  function (req, res){
	res.render("index_old.html");
}

exports.getProjects = function(req,res){
	var output = [];
	Step(
		function getProjects(){
			Project.find({}, this).desc('created_on')
		},
		function loopThroughDocs(err, docs){

			var done = false;
			var len = docs.length;
			var counter = 0;
			var _docs = docs;
			_docs.forEach(function (doc){
				Task.count({project : doc._id}, function (err, count){
					doc.count = count;
					// console.log("count is " + count)
					var x = {
						title : doc.title,
						_id : doc._id,
						created_on : doc.created_on,
						count : count
					}
					// console.log(doc)
					// console.log(x)
					output.push(x);
					counter++;
					if(counter >= len){
						res.send(output)
					}
				});	
			})
		}
	);
}

exports.createProject  =  function	(req,res){
	var data = req.body;
	var project = new Project();
	project.title = data.title;
	project.lead = user.username;
	project.status = 'pending';
	project.created_on = new Date();
	project.completeness = 0;

	project.save(function (err){
		//console.log(project)
		res.send({
			model: project,
			message : "Project created sucessfully"
		});
	});
	
}

exports.updateProject =  function (req, res){


}

exports.deleteProject =  function (req, res){
	var id = mongoose.Types.ObjectId.fromString(req.params.id);
	Task.find({project :  id},function (err,docs){
		if(docs.length > 0 ){
			res.send({
				message : '"Cannot delete this project. There are some tasks asscociated with it");'
			});
		}
		else {
			Project.findById(id, function (err,doc){
				if(doc){
					doc.remove(function(err){
						res.send({
							message : "Project deleted"
						});
					});
				}else {
					res.send({
						message : "You are trying to delete a project that does not exist"
					});
				}
			});

			
		}
	});
}

exports.getTasks = function (req, res) {
	var data = req.query;
	//console.log(req.params)
	var id  = false;
	//if(data && data.projectId){
	if(data){
		if(data.projectId == null || data.projectId == "null" ) {
			Task.find({}, function (err,docs){
				res.send(docs);
			});	
		}
		else {
			id = data.projectId;
			id = mongoose.Types.ObjectId.fromString(id);
			Task.find({project :  id},function (err, docs){
				res.send(docs);
			});	
		}
	}else {
		res.send({});
	}
	
}

exports.createTask  =  function(req,res){
	var data = req.body;
	var task =  new Task({
		title : data.title,
		project : data.project,
		status : 'pending',
		assignedTo : user.username,
		created_on : new Date()
	});

	task.save(function(err){
		res.send({
			model : task,
			message : 'Task created sucessfully'
		});
	});
	
}


exports.updateTask =  function(req, res){
	
	var id = mongoose.Types.ObjectId.fromString(req.params.id);
	var title =  req.body.title;
	var status = req.body.status;
	//console.log(req.body)
	Task.findById(id, function (err, doc){
		doc.title = title;
		doc.status = status;
		doc.updated_at  = new Date();

		doc.save(function(err, doc){
			//console.log(doc)
			if(!err)
				res.send({message: "Task Updated sucessfully"});	
			//console.log(doc)
		});
		
	});
}

exports.deleteTask =  function (req, res){
	var id = mongoose.Types.ObjectId.fromString(req.params.id);
	Task.findById(id, function (err, doc){
  		doc.remove(function(err){
  			res.send({
				message : 'task deleted sucessfully'
			});
  		});
	});
}