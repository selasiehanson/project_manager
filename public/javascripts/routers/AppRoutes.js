// Generated by CoffeeScript 1.3.3
(function() {

  (function(routes, collections, views, _project) {
    routes.Navigator = Backbone.Router.extend({
      data: null,
      view: null,
      routes: {
        "projects/task/:id": 'showTasks',
        'project/all': 'showProjects',
        'tasks/summary': 'showSummarizedTasks',
        'tasks/:id': 'showTaskInfo',
        "dashboard": 'showDashboard',
        "*actions": 'defaultRoute'
      },
      initialize: function() {
        Backbone.history.start();
        return this;
      },
      defaultRoute: function() {
        return this.showDashboard();
      },
      createPTView: function() {
        var ptView;
        ptView = new views.PTView();
        views.centralPane.showView(ptView);
      },
      showProjects: function() {
        this.createPTView();
        collections.ProjectsCollection.fetch({
          success: function(col, res) {
            var view;
            collections.ProjectsCollection.pager();
            view = new views.ProjectsContainer({
              collection: collections.ProjectsCollection
            });
            view.render();
          }
        });
      },
      showTasks: function(id) {
        var project, self, tasks;
        self = this;
        id = $.trim(id);
        project = collections.ProjectsCollection.get(id);
        tasks = [];
        if (project) {
          _project.title = project.get("title");
          _project.id = id;
          collections.tasksCollection.close();
          collections.tasksCollection = new app.collections.TasksCollection();
          collections.tasksCollection.fetch({
            data: {
              projectId: id
            },
            success: function() {
              collections.tasksCollection.pager();
              if (views.tasksContainer) {
                views.tasksContainer.onClose();
              }
              views.tasksContainer = new views.TasksContainer({
                collection: collections.tasksCollection
              });
              return views.tasksContainer.render();
            }
          });
          return;
        } else {
          _project.title = null;
          _project.id = null;
        }
      },
      showDashboard: function() {
        var dashboard;
        dashboard = new views.Dashboard();
        views.centralPane.showView(dashboard);
        dashboard.updateGraphs();
      },
      showTaskInfo: function(id) {},
      clearTaskInfo: function() {
        var data;
        return data = {
          task: {
            created_on: '',
            assignedTo: '',
            status: ''
          },
          project: _project
        };
      },
      showSummarizedTasks: function(all) {
        var self;
        self = this;
        _project.title = null;
        _project.id = null;
        return collections.TasksCollection.fetch({
          data: {
            projectId: null
          },
          success: function() {
            var first, view;
            view = new views.TasksView({
              collection: collections.TasksCollection
            });
            view.render();
            collections.TasksCollection.each(view.addOne);
            first = collections.TasksCollection.at(0);
            if (first) {
              return self.showTaskInfo(first.id);
            } else {
              return self.clearTaskInfo();
            }
          }
        });
      }
    });
  })(app.routes, app.collections, app.views, app.project);

}).call(this);
