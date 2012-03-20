
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html');
};

exports.projects = function(req,res){
	var data = [
				{title : "Project 1", tasks :["one" , "two","three","four","five","six","seven","eight", "nine", "ten"]},
				{title : "Project 2", tasks :["one" , "two","three","four","five","six","seven","eight"]},
				{title : "Project 3", tasks :["one" , "two","three","four","five","six"]},
				{title : "Project 4", tasks :["one" , "two","three","four"]},
				{title : "Project 5", tasks :["one" , "two"]},
				{title : "Project 6", tasks :['one'] }
	];
	res.send(data);
}