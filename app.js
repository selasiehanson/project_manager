
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project_manager_dev');
//mongoose.connect('mongodb://localhost/project_manager_dev');




var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  //app.set('view engine', 'ejs');
  //app.set('view options' , {layout : false});

  // disable layout
  app.set("view options", {layout: false});

  // make a custom html template
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

//Projects
app.get('/projects',routes.getProjects);
app.post('/projects', routes.createProject);
app.put('/projects/:id',routes.updateProject);
app.del('/projects/:id',routes.deleteProject);

//Tasks
app.get('/tasks',routes.getTasks);
app.post('/tasks',routes.createTask);
app.put('/tasks/:id',routes.updateTask);
app.del('/tasks/:id',routes.deleteTask);

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
