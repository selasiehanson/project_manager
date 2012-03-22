var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProjectSchema = new Schema({
	title : String,
	lead : String,
	//tasks : [TaskSchema],
	status : String,
	completeness : Number,
	created_on : Date,
	commenced_on : Date,
	completed_on: Date,

});

module.exports = mongoose.model("Project",ProjectSchema);