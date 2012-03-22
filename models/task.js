var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskSchema = new Schema ({
	title : String ,
	created_on : Date,
	commenced_on : Date,
	completed_on : Date,
	assignedTo : String,
	status : String,
	project : ObjectId
});


module.exports = mongoose.model("Task",TaskSchema);

