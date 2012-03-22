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


exports.updateTask =  function(){

}

exports.deleteTask =  function (req, res){
	console.log(req)
	res.send({
		message : 'task deleted sucessfully'
	})
}