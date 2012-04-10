var mongoose = require('mongoose');
var Project = require('../models/Project');
var Task =  require('../models/Task');

var user = {
	username : 'Selasie Hanson',

}
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html');
};

exports.getProjects = function(req,res){
	Project.find({},function (err, docs){
		res.send(docs);
	});
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
				message : '"Cannot delete this project. There are some stasks asscociated with it");'
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
	var id  = data.projectId;
	
	id = mongoose.Types.ObjectId.fromString(id);
	Task.find({project :  id},function (err, docs){
		//console.log(docs);
		res.send(docs);
	});

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
	Task.findById(id, function (err, doc){
		doc.title = title;
		doc.save(function(err, doc){
			res.send({message: "Task Updated sucessfully"});	
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